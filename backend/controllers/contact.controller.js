import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { ensureContact } from "../services/contact.service.js";

export const addContact = async (req, res) => {
  const contactId = String(req.body?.contactId ?? "");
  if (!mongoose.isValidObjectId(contactId)) return res.status(400).json({ error: "Invalid user" });
  if (contactId === String(req.userId)) {
    return res.status(400).json({ error: "You can't add yourself" });
  }

  try {
    if (!(await User.exists({ _id: contactId }))) {
      return res.status(404).json({ error: "User not found" });
    }

    const contact = await ensureContact(req.userId, contactId).populate("contact", "name email");

    res.json(contact);
  } catch (err) {
    console.error("addContact failed:", err.message);
    res.status(500).json({ error: "Could not add contact" });
  }
};

// Only connections the logged-in user made, so people who added me stay hidden.
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.userId })
      .sort({ createdAt: -1 })
      .populate("contact", "name email");
    res.json(contacts);
  } catch (err) {
    console.error("getContacts failed:", err.message);
    res.status(500).json({ error: "Could not load contacts" });
  }
};
