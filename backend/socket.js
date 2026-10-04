import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { requireSocketAuth } from "./middleware/auth.middleware.js";

export const initSocket = (server, clientOrigin) => {
  const io = new Server(server, { cors: { origin: clientOrigin, credentials: true } });
  io.engine.use(cookieParser());
  io.use(requireSocketAuth);

  io.on("connection", (socket) => {
    
    socket.on("join_chat", (chatId) => {

    });

    socket.on("send_message", ({ chatId, text } = {}) => {

    });

    socket.on("disconnect", (reason) => {

    });
  });

  return io;
};
