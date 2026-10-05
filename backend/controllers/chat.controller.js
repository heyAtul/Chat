import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import { dmRoomId } from "../utils/dmRoomId.js";

// Messages between the logged-in user and :contactId, oldest first.
export const getChats = async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.isValidObjectId(contactId)) return res.status(400).json({ error: "Invalid user" });

  try {
    // The room id is built from the logged-in user, so nobody can read other people's chats.
    const chats = await Chat.find({ roomId: dmRoomId(req.userId, contactId) }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    console.error("getChats failed:", err.message);
    res.status(500).json({ error: "Could not load chats" });
  }
};
