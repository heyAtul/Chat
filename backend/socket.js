import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { requireSocketAuth } from "./middleware/auth.middleware.js";
import Contact from "./models/Contact.js";

export const initSocket = (server, clientOrigin) => {
  const io = new Server(server, { cors: { origin: clientOrigin, credentials: true } });
  io.engine.use(cookieParser());
  io.use(requireSocketAuth);

  io.on("connection", (socket) => {
    console.log(socket.data.userId + " joined")
    socket.join(socket.data.userId);

    socket.on("join_chat", (chatId) => {

    });

    socket.on("send_message", async ({ to, message } = {}) => {
      let fromUserId = socket.data.userId
      let { name } = socket.data.userData
      let createdAt = Date.now()
      if (!mongoose.isValidObjectId(to)) return;

      try {
        await Contact.findOneAndUpdate({ owner: to, contact: fromUserId }, {}, { upsert: true });
      } catch (err) {
        console.error("send_message failed:", err.message);
        return;
      }

      io.to(to).to(fromUserId).emit("receive_message", { message, fromUserId, toUserId: to, name, createdAt });
    });

    socket.on("disconnect", (reason) => {

    });
  });

  return io;
};
