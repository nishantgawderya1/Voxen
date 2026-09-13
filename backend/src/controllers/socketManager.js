import { Server } from "socket.io";
import config from "../config/env.js";
import { createMemoryStore } from "../state/memoryStore.js";

// Room state lives behind a store so the process isn't the only place it can
// live. `createMemoryStore` is the single-instance default; pass a Redis-backed
// store (see state/redisStore.js) to run more than one backend instance.
const connectToSocket = (server, { store = createMemoryStore(), adapter } = {}) => {
  const io = new Server(server, {
    cors: {
      // Same allowlist as the REST layer — `origin: "*"` with credentials let
      // any page on the internet open a socket against this server.
      origin(origin, cb) {
        if (!origin) return cb(null, true);
        if (!config.isProd && config.corsOrigins.length === 0) {
          return cb(null, true);
        }
        return config.corsOrigins.includes(origin)
          ? cb(null, true)
          : cb(new Error("Origin not allowed by CORS"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // With the Redis adapter, `io.to(room).emit` reaches sockets held by other
  // instances; without it a room is only ever one process wide.
  if (adapter) io.adapter(adapter);

  const publicMeta = async (path) => {
    const { host, names, media, hands } = await store.getMeta(path);
    return { host, names, media, hands };
  };

  // Which room a socket belongs to. The store is the only source of truth:
  // a socket admitted by a host on another instance never touches this
  // process's socket.data, so local state would be blank for it.
  const pathOf = (socket) => store.roomOf(socket.id);

  // Fully admit a socket into a room: bookkeeping + RTC kick-off broadcast.
  // Takes an id, not a socket object, because the socket being admitted is
  // frequently held by a different instance than the host doing the admitting.
  const admitSocket = async (socketId, path, username) => {
    await store.addMember(path, socketId, username);

    // socketsJoin routes through the adapter, so it works regardless of which
    // instance holds the socket. socket.join() would only work locally.
    await io.in(socketId).socketsJoin(path);

    const members = await store.getMembers(path);
    const meta = await publicMeta(path);

    // Addressed per-socket rather than to the room, because each recipient
    // needs to know which id just joined.
    for (const id of members) {
      io.to(id).emit("user-joined", socketId, members, meta);
    }

    for (const message of await store.getMessages(path)) {
      io.to(socketId).emit(
        "chat-message",
        message["data"],
        message["sender"],
        message["socket-id-sender"]
      );
    }

    await store.touch(path);
  };

  io.on("connection", (socket) => {
    const safely = (handler) => (...args) =>
      Promise.resolve(handler(...args)).catch((e) =>
        // An unhandled rejection in a socket handler would take the process
        // down and every call with it.
        console.error("[socket]", socket.id, e)
      );

    socket.on(
      "join-call",
      safely(async (path, username) => {
        if (typeof path !== "string" || !path) return;

        const occupied = (await store.getMembers(path)).length > 0;

        if (!occupied) {
          // First one in — becomes host, joins straight away.
          await admitSocket(socket.id, path, username);
          io.to(socket.id).emit("admitted", await publicMeta(path));
          return;
        }

        // Room occupied — knock and wait for the host.
        await store.addPending(path, socket.id, username);
        socket.data.knockPath = path;
        io.to(socket.id).emit("waiting-room");

        const host = await store.getHost(path);
        if (host) {
          io.to(host).emit("join-request", socket.id, username || "Guest");
        }
      })
    );

    socket.on(
      "admit-user",
      safely(async (id) => {
        const path = await pathOf(socket);
        if (!path) return;
        if (socket.id !== (await store.getHost(path))) return; // host-only

        // Clearing the pending entry is what makes this idempotent — a second
        // admit, or the knocker's own disconnect, finds nothing to do.
        const username = await store.removePending(path, id);
        if (username === null) return;

        await admitSocket(id, path, username);
        io.to(id).emit("admitted", await publicMeta(path));
      })
    );

    socket.on(
      "deny-user",
      safely(async (id) => {
        const path = await pathOf(socket);
        if (!path) return;
        if (socket.id !== (await store.getHost(path))) return;

        const username = await store.removePending(path, id);
        if (username === null) return;

        io.to(id).emit("join-denied");
      })
    );

    socket.on(
      "media-state",
      safely(async ({ audio, video } = {}) => {
        const path = await pathOf(socket);
        if (!path) return;
        const next = await store.setMedia(path, socket.id, { audio, video });
        io.to(path).emit("media-state", socket.id, next);
      })
    );

    socket.on(
      "raise-hand",
      safely(async (raised) => {
        const path = await pathOf(socket);
        if (!path) return;
        await store.setHand(path, socket.id, !!raised);
        io.to(path).emit("raise-hand", socket.id, !!raised);
      })
    );

    socket.on(
      "reaction",
      safely(async (emoji) => {
        const path = await pathOf(socket);
        if (!path) return;
        const safe = String(emoji).slice(0, 8);
        const name = (await store.getName(path, socket.id)) || "Guest";
        io.to(path).emit("reaction", socket.id, safe, name);
      })
    );

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("transcript-update", ({ roomId, text, speaker, timestamp } = {}) => {
      if (!roomId) return;
      socket.to(roomId).emit("transcript-update", { text, speaker, timestamp });
      socket.emit("transcript-update", { text, speaker, timestamp });
    });

    socket.on(
      "chat-message",
      safely(async (data, sender) => {
        const path = await pathOf(socket);
        if (!path) return;

        await store.pushMessage(path, {
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        io.to(path).emit("chat-message", data, sender, socket.id);
        await store.touch(path);
      })
    );

    socket.on(
      "disconnect",
      safely(async () => {
        // Knocker gave up — clear the pending request and tell the host.
        const knockPath = socket.data.knockPath;
        if (knockPath) {
          const removed = await store.removePending(knockPath, socket.id);
          if (removed !== null) {
            const host = await store.getHost(knockPath);
            if (host) io.to(host).emit("join-request-cancelled", socket.id);
          }
        }

        const key = await pathOf(socket);
        if (!key) return;

        const before = await store.getMembers(key);
        if (!before.includes(socket.id)) return;

        for (const id of before) {
          io.to(id).emit("user-left", socket.id);
        }

        const wasHost = (await store.getHost(key)) === socket.id;
        await store.removeMember(key, socket.id);
        const remaining = await store.getMembers(key);

        if (remaining.length === 0) {
          // Everyone admitted has left. Anyone still knocking would wait
          // forever with no host to let them in, so hand the empty room to the
          // next in line — exactly what would have happened had they arrived
          // to find it empty. Remaining knockers answer to that new host.
          const waiting = Object.entries(await store.getPending(key));

          // fetchSockets goes through the adapter, so a knocker connected to
          // another instance still counts as live.
          let nextUp = null;
          for (const entry of waiting) {
            const live = await io.in(entry[0]).fetchSockets();
            if (live.length > 0) {
              nextUp = entry;
              break;
            }
          }

          if (nextUp) {
            const [nextId, nextName] = nextUp;
            await store.removePending(key, nextId);
            await store.setHost(key, null); // addMember promotes the first one in
            await admitSocket(nextId, key, nextName);
            io.to(nextId).emit("admitted", await publicMeta(key));

            const newHost = await store.getHost(key);
            for (const [pendingId, pendingName] of Object.entries(
              await store.getPending(key)
            )) {
              io.to(newHost).emit("join-request", pendingId, pendingName);
            }
            return;
          }

          await store.dispose(key);
          return;
        }

        // Host left — promote the longest-standing participant and hand over
        // any queued join requests.
        if (wasHost) {
          const newHost = remaining[0];
          await store.setHost(key, newHost);
          io.to(key).emit("host-changed", newHost, await publicMeta(key));
          for (const [pendingId, pendingName] of Object.entries(
            await store.getPending(key)
          )) {
            io.to(newHost).emit("join-request", pendingId, pendingName);
          }
        }
      })
    );
  });

  io.voxenStore = store;
  return io;
};

export default connectToSocket;
