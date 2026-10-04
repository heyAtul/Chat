import mongoose from "mongoose";

// A one-way connection: `owner` added `contact` to their chat list.
// The contact gets their own connection back only when a message is sent,
// so until then they don't see the owner at all.
const contactSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

contactSchema.index({ owner: 1, contact: 1 }, { unique: true });

export default mongoose.model("Contact", contactSchema);
