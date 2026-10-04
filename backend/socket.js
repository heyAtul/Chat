import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { requireSocketAuth } from "./middleware/auth.middleware.js";

export const initSocket = (server, clientOrigin) => {
  const io = new Server(server, { cors: { origin: clientOrigin, credentials: true } });
  io.engine.use(cookieParser());
  io.use(requireSocketAuth);

  io.on("connection", (socket) => {
    console.log(socket.data.userId + " joined")
    socket.join(socket.data.userId);

    socket.on("join_chat", (chatId) => {

    });

    socket.on("send_message", ({ to, message } = {}) => {
      let fromUserId = socket.data.userId
      let { name } = socket.data.userData
      let createdAt = Date.now()
      io.to(to).to(fromUserId).emit("receive_message", { message, fromUserId, toUserId: to, name, createdAt });
    });

    socket.on("disconnect", (reason) => {

    });
  });

  return io;
};
