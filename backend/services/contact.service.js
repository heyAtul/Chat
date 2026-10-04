import Contact from "../models/Contact.js";

// Creates the one-way connection owner → contact, or returns it if it already exists.
export const ensureContact = (ownerId, contactId) =>
  Contact.findOneAndUpdate(
    { owner: ownerId, contact: contactId },
    {},
    { upsert: true, returnDocument: "after" }
  );
