import mongoose from "mongoose";

// One document per message. `roomId` is a group room's id, or for a one-to-one chat
// the two user ids sorted and joined with "-" (see utils/dmRoomId.js).
const chatSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    // The sender, copied from their login token when the message was sent.
    fromUserData: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    roomId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Loading a chat finds its messages by room, oldest first.
chatSchema.index({ roomId: 1, createdAt: 1 });

export default mongoose.model("Chat", chatSchema);
