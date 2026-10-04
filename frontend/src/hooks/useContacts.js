import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function useContacts() {
  const [contacts, setContacts] = useState([]);

  const loadContacts = () =>
    api.get("/api/contacts").then(({ data }) => setContacts(data)).catch(() => {});

  useEffect(() => {
    loadContacts();
  }, []);

  // Saves the user as my contact and puts them at the top of the list (if not already there).
  const createContact = async (userId) => {
    try {
      const { data: contact } = await api.post("/api/contacts", { contactId: userId });
      setContacts((prev) => (prev.some((c) => c._id === contact._id) ? prev : [contact, ...prev]));
    } catch {
      // Contact could not be added; the list stays as it was.
    }
  };

  return { contacts, loadContacts, createContact };
}
