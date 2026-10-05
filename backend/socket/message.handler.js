import mongoose from "mongoose";
import { ensureContact } from "../services/contact.service.js";
import Chat from "../models/Chat.js";
import { dmRoomId } from "../utils/dmRoomId.js";

export const registerMessageHandlers = (io, socket) => {
  const { userId: fromUserId, userData: fromUserData } = socket.data;

  const sendToUser = async (toUserId, message) => {
    if (!mongoose.isValidObjectId(toUserId)) return;
    let createdAt = Date.now()
    let roomId = dmRoomId(fromUserId, toUserId)
    let chatData = {
      message,
      fromUserData,
      createdAt,
      roomId
    }
    try {
      // The receiver gets the sender as a contact with the first message, even if they're offline.
      await ensureContact(toUserId, fromUserId);
      await Chat.create(chatData);
    } catch (err) {
      console.error("send_message failed:", err.message);
      return;
    }

    io.to(toUserId).to(fromUserId).emit("receive_message", chatData);
  };

  const sendToRoom = async (roomId, message) => {
    // Only sockets that have joined the room can send to it.
    if (!socket.rooms.has(roomId)) return;
    let createdAt = Date.now()
    let chatData = {
      message,
      fromUserData,
      createdAt,
      roomId
    }
    try {
      await Chat.create(chatData);
    } catch (err) {
      console.error("send_message failed:", err.message);
      return;
    }
    io.to(roomId).emit("receive_message", chatData);
  };

  // Send with `to` for a single user, or with `roomId` for a room.
  socket.on("send_message", async ({ toUserId, roomId, message } = {}) => {
    if (roomId) return await sendToRoom(String(roomId), message);
    await sendToUser(toUserId, message);
  });
};
