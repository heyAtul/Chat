import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { requireSocketAuth } from "../middleware/auth.middleware.js";
import { registerMessageHandlers } from "./message.handler.js";

export const initSocket = (server, clientOrigin) => {
  const io = new Server(server, { cors: { origin: clientOrigin, credentials: true } });
  io.engine.use(cookieParser());
  io.use(requireSocketAuth);

  io.on("connection", (socket) => {
    // Each user has a personal room named after their id, so all their open tabs get their messages.
    socket.join(socket.data.userId);
    registerMessageHandlers(io, socket);
  });

  return io;
};
