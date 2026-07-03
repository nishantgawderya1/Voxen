import { Server } from "socket.io";

let connection = {};
let timeOnline = {};
let messages = {};

const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (path) => {
      if (connection[path] === undefined) {
        connection[path] = [];
      }
      connection[path].push(socket.id);
      socket.join(path);

      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connection[path].length; a++) {
        io.to(connection[path][a]).emit(
          "user-joined",
          socket.id,
          connection[path]
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
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());

      var key;

      for (const [k, v] of JSON.parse(
        JSON.stringify(Object.entries(connection))
      )) {
        for (let a = 0; a < v.length; ++a) {
          if (v[a] === socket.id) {
            key = k;

            for (let a = 0; a < connection[key].length; ++a) {
              io.to(connection[key][a]).emit("user-left", socket.id);
            }

            var index = connection[key].indexOf(socket.id);

            connection[key].splice(index, 1);

            if (connection[key].length === 0) {
              delete connection[key];
            }
          }
        }
      }
    });
  });

  return io;
};

export default connectToSocket;
