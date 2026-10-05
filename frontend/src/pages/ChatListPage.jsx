import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import api from "../api/axios.js";
import ChatHeader from "../components/ChatHeader.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import ContactList from "../components/ContactList.jsx";
import useChatSocket from "../hooks/useChatSocket.js";
import useContacts from "../hooks/useContacts.js";
import { dmRoomId } from "../utils/dmRoomId.js";

export default function ChatListPage() {
  const [user, setUser] = useState(null);
  const { contacts, loadContacts, createContact } = useContacts();
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get("/api/auth/me").then(({ data }) => setUser(data)).catch(() => {});
  }, []);

  const handleIncomingMessage = (msg) => {
    const openRoomId = user && activeContact ? dmRoomId(user._id, activeContact._id) : null;
    if (msg.roomId === openRoomId) {
      setMessages((prev) => [...prev, msg]);
    } else if (!contacts.some((c) => c.contact._id === msg.fromUserData.id)) {
      // The server has already saved this contact; reload the list to show it.
      loadContacts();
    }
  };

  const { sendMessage } = useChatSocket(handleIncomingMessage);

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <ChatHeader user={user} onSelectUser={(selected) => createContact(selected._id)} />

      <Box sx={{ flex: 1, minHeight: 0, display: "flex" }}>
        {/* On phones only one panel shows at a time: the list, or the open chat. */}
        <Box
          sx={{
            width: { xs: "100%", md: 360 },
            flexShrink: 0,
            overflowY: "auto",
            borderRight: { md: 1 },
            borderColor: { md: "divider" },
            display: { xs: activeContact ? "none" : "block", md: "block" },
          }}
        >
          <ContactList
            contacts={contacts}
            activeContactId={activeContact?._id}
            onSelect={setActiveContact}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            flexDirection: "column",
            display: { xs: activeContact ? "flex" : "none", md: "flex" },
          }}
        >
          {activeContact ? (
            // key: a new chat starts with an empty message box.
            <ChatWindow
              key={activeContact._id}
              contact={activeContact}
              messages={messages}
              currentUserId={user?._id}
              onBack={() => setActiveContact(null)}
              onSend={(text) => sendMessage(activeContact._id, text)}
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "grid",
                placeItems: "center",
                bgcolor: "background.default",
                color: "text.secondary",
              }}
            >
              <Typography>Select a contact to start chatting</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
