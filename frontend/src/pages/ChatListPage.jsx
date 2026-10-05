import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import api from "../api/axios.js";
import ChatIntro from "../components/ChatIntro.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import Sidebar from "../components/Sidebar.jsx";
import useChatSocket from "../hooks/useChatSocket.js";
import useContacts from "../hooks/useContacts.js";
import { dmRoomId } from "../utils/dmRoomId.js";

export default function ChatListPage() {
  const [user, setUser] = useState(null);
  const { contacts, loadContacts, createContact } = useContacts();
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  useEffect(() => {
    api.get("/api/auth/me").then(({ data }) => setUser(data)).catch(() => {});
  }, []);

  // Load the open chat's history. Switching chats cancels the previous request.
  useEffect(() => {
    if (!activeContact) return;
    const controller = new AbortController();
    setMessages([]);
    setLoadingChats(true);

    api
      .get(`/api/chats/${activeContact._id}`, { signal: controller.signal })
      .then(({ data }) => {
        // Keep live messages that arrived while loading and are newer than the fetched history.
        const lastTime = data.length ? new Date(data[data.length - 1].createdAt).getTime() : 0;
        setMessages((live) => [...data, ...live.filter((m) => new Date(m.createdAt).getTime() > lastTime)]);
      })
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setLoadingChats(false);
      });

    return () => controller.abort();
  }, [activeContact]);

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

  // Picking someone from search saves them as a contact and opens their chat, like WhatsApp.
  const handleSelectUser = (selected) => {
    createContact(selected._id);
    setActiveContact(selected);
  };

  return (
    // On very wide screens WhatsApp Web shows the app as a centered card over a green strip.
    <Box sx={{ position: "relative", height: "100dvh", p: { xl: "19px" }, bgcolor: "chat.border" }}>
      <Box sx={{ display: { xs: "none", xl: "block" }, position: "absolute", inset: "0 0 auto 0", height: 127, bgcolor: "primary.main" }} />

      <Box
        sx={{
          position: "relative",
          height: "100%",
          maxWidth: 1600,
          mx: "auto",
          display: "flex",
          bgcolor: "background.paper",
          boxShadow: { xl: "0 6px 18px rgba(11, 20, 26, 0.05)" },
        }}
      >
        {/* On phones only one panel shows at a time: the chat list, or the open chat. */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%", lg: "30%" },
            minWidth: { md: 340 },
            flexShrink: 0,
            borderRight: { md: 1 },
            borderColor: { md: "chat.border" },
            display: { xs: activeContact ? "none" : "block", md: "block" },
          }}
        >
          <Sidebar
            user={user}
            contacts={contacts}
            activeContactId={activeContact?._id}
            onSelectContact={setActiveContact}
            onSelectUser={handleSelectUser}
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
              loading={loadingChats}
              currentUserId={user?._id}
              onBack={() => setActiveContact(null)}
              onSend={(text) => sendMessage(activeContact._id, text)}
            />
          ) : (
            <ChatIntro />
          )}
        </Box>
      </Box>
    </Box>
  );
}
