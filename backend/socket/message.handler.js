import mongoose from "mongoose";
import { ensureContact } from "../services/contact.service.js";

export const registerMessageHandlers = (io, socket) => {
  const { userId, userData } = socket.data;

  socket.on("send_message", async ({ to, message } = {}) => {
    if (!mongoose.isValidObjectId(to)) return;

    try {
      // The receiver gets the sender as a contact with the first message, even if they're offline.
      await ensureContact(to, userId);
    } catch (err) {
      console.error("send_message failed:", err.message);
      return;
    }

    io.to(to).to(userId).emit("receive_message", {
      message,
      fromUserId: userId,
      toUserId: to,
      name: userData.name,
      createdAt: Date.now(),
    });
  });
};
