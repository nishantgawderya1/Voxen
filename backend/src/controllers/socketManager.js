import { Server } from "socket.io";

// connection[path] stays the plain array of admitted socket ids so the
// existing chat/signal loops keep working untouched.
let connection = {};
let timeOnline = {};
let messages = {};

// Per-room meeting metadata layered on top of `connection`.
// rooms[path] = {
//   host: socketId,
//   names: { socketId: username },
//   media: { socketId: { audio, video } },
//   hands: { socketId: true },
//   pending: { socketId: username },   // knocking, not yet admitted
// }
let rooms = {};

const roomMeta = (path) => {
  if (!rooms[path]) {
    rooms[path] = { host: null, names: {}, media: {}, hands: {}, pending: {} };
  }
  return rooms[path];
};

const publicMeta = (path) => {
  const m = roomMeta(path);
  return { host: m.host, names: m.names, media: m.media, hands: m.hands };
};

const findRoomOf = (socketId) => {
  for (const [path, ids] of Object.entries(connection)) {
    if (ids.includes(socketId)) return path;
  }
  return null;
};

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  // Fully admit a socket into a room: bookkeeping + RTC kick-off broadcast.
  const admitSocket = (socket, path, username) => {
    const meta = roomMeta(path);

    if (connection[path] === undefined) {
      connection[path] = [];
    }
    connection[path].push(socket.id);
    socket.join(path);
    socket.data.path = path;

    meta.names[socket.id] = username || "Guest";
    meta.media[socket.id] = { audio: true, video: true };
    if (!meta.host) meta.host = socket.id;

    timeOnline[socket.id] = new Date();

    // Same broadcast shape as before, plus a meta payload (names/host/…).
    for (let a = 0; a < connection[path].length; a++) {
      io.to(connection[path][a]).emit(
        "user-joined",
        socket.id,
        connection[path],
        publicMeta(path)
      );
    }

    if (messages[path] !== undefined) {
      for (let a = 0; a < messages[path].length; ++a) {
        io.to(socket.id).emit(
          "chat-message",
          messages[path][a]["data"],
          messages[path][a]["sender"],
          messages[path][a]["socket-id-sender"]
        );
      }
    }
  };

  io.on("connection", (socket) => {
    socket.on("join-call", (path, username) => {
      const meta = roomMeta(path);
      const occupied = connection[path] && connection[path].length > 0;

      if (!occupied) {
        // First one in — becomes host, joins straight away.
        admitSocket(socket, path, username);
        io.to(socket.id).emit("admitted", publicMeta(path));
        return;
      }

      // Room occupied — knock and wait for the host.
      meta.pending[socket.id] = username || "Guest";
      socket.data.knockPath = path;
      io.to(socket.id).emit("waiting-room");
      if (meta.host) {
        io.to(meta.host).emit("join-request", socket.id, username || "Guest");
      }
    });

    socket.on("admit-user", (id) => {
      const path = socket.data.path;
      if (!path) return;
      const meta = roomMeta(path);
      if (socket.id !== meta.host) return; // host-only
      const username = meta.pending[id];
      if (username === undefined) return;

      delete meta.pending[id];
      const target = io.sockets.sockets.get(id);
      if (!target) return;
      delete target.data.knockPath;

      admitSocket(target, path, username);
      io.to(id).emit("admitted", publicMeta(path));
    });

    socket.on("deny-user", (id) => {
      const path = socket.data.path;
      if (!path) return;
      const meta = roomMeta(path);
      if (socket.id !== meta.host) return;
      if (meta.pending[id] === undefined) return;

      delete meta.pending[id];
      const target = io.sockets.sockets.get(id);
      if (target) delete target.data.knockPath;
      io.to(id).emit("join-denied");
    });

    socket.on("media-state", ({ audio, video }) => {
      const path = socket.data.path;
      if (!path) return;
      const meta = roomMeta(path);
      meta.media[socket.id] = { audio: !!audio, video: !!video };
      io.to(path).emit("media-state", socket.id, meta.media[socket.id]);
    });

    socket.on("raise-hand", (raised) => {
      const path = socket.data.path;
      if (!path) return;
      const meta = roomMeta(path);
      if (raised) meta.hands[socket.id] = true;
      else delete meta.hands[socket.id];
      io.to(path).emit("raise-hand", socket.id, !!raised);
    });

    socket.on("reaction", (emoji) => {
      const path = socket.data.path;
      if (!path) return;
      const meta = roomMeta(path);
      const safe = String(emoji).slice(0, 8);
      io.to(path).emit("reaction", socket.id, safe, meta.names[socket.id] || "Guest");
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("transcript-update", ({ roomId, text, speaker, timestamp }) => {
      socket.to(roomId).emit("transcript-update", { text, speaker, timestamp });
      socket.emit("transcript-update", { text, speaker, timestamp });
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connection).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }

          return [room, isFound];
        },
        ["", false]
      );

      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }

        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, data);

        connection[matchingRoom].forEach((elem) => {
          io.to(elem).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      // Knocker gave up — clear the pending request and tell the host.
      const knockPath = socket.data.knockPath;
      if (knockPath && rooms[knockPath]?.pending[socket.id] !== undefined) {
        delete rooms[knockPath].pending[socket.id];
        if (rooms[knockPath].host) {
          io.to(rooms[knockPath].host).emit("join-request-cancelled", socket.id);
        }
      }

      const key = findRoomOf(socket.id);
      if (!key) return;

      for (let a = 0; a < connection[key].length; ++a) {
        io.to(connection[key][a]).emit("user-left", socket.id);
      }

      const index = connection[key].indexOf(socket.id);
      connection[key].splice(index, 1);

      const meta = roomMeta(key);
      delete meta.names[socket.id];
      delete meta.media[socket.id];
      delete meta.hands[socket.id];

      if (connection[key].length === 0) {
        delete connection[key];
        delete rooms[key];
        return;
      }

      // Host left — promote the longest-standing participant and hand
      // over any queued join requests.
      if (meta.host === socket.id) {
        meta.host = connection[key][0];
        io.to(key).emit("host-changed", meta.host, publicMeta(key));
        for (const [pendingId, pendingName] of Object.entries(meta.pending)) {
          io.to(meta.host).emit("join-request", pendingId, pendingName);
        }
      }
    });
  });

  return io;
};

export default connectToSocket;
