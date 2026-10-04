import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  AppBar,
  Autocomplete,
  Box,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  Menu,
  MenuItem,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import { io } from "socket.io-client";
import debounce from "lodash/debounce";
import api from "../api/axios.js";
import ChatLogo from "../components/ChatLogo.jsx";
import UserAvatar from "../components/UserAvatar.jsx";
import UserInfo from "../components/UserInfo.jsx";

const SEARCH_DELAY = 300; // ms to wait after the last keystroke before searching

// e.g. "03:45 PM - 04/09/2071" (time, then date as DD/MM/YYYY)
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${time} - ${date.toLocaleDateString("en-GB")}`;
};

export default function ChatListPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchAbortRef = useRef(null);
  const socketRef = useRef(null);
  const [contacts, setContacts] = useState([]);
  const contactsRef = useRef([]);
  const [activeContact, setActiveContact] = useState(null);
  const activeContactRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const loadContacts = () =>
    api.get("/api/contacts").then(({ data }) => setContacts(data)).catch(() => { });

  useEffect(() => {
    api.get("/api/auth/me").then(({ data }) => setUser(data)).catch(() => { });
    loadContacts();
  }, []);

  useEffect(() => {
    contactsRef.current = contacts;
  }, [contacts]);

  // Saves the user as my contact and puts them at the top of the list (if not already there).
  const createContact = async (userId) => {
    try {
      const { data: contact } = await api.post("/api/contacts", { contactId: userId });
      setContacts((prev) => (prev.some((c) => c._id === contact._id) ? prev : [contact, ...prev]));
    } catch {
      // Contact could not be added; the list stays as it was.
    }
  };

  useEffect(() => {
    // withCredentials sends the httpOnly token cookie, which the server checks before accepting
    const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      if (err.message === "Not authenticated") navigate("/login", { replace: true });
    });

    socket.on("receive_message", ({ message, fromUserId, toUserId, name, createdAt }) => {
      console.log(message, fromUserId, toUserId, name, createdAt)
      const openId = activeContactRef.current?._id;
      if (fromUserId === openId || toUserId === openId) {
        setMessages((prev) => [...prev, { message, fromUserId, toUserId, name, createdAt }])
      }
      else {
        // The listener is set up once, so read contacts from the ref, not the (stale) state.
        const isKnown = contactsRef.current.some((c) => c.contact._id === fromUserId);
        // The server has already saved this contact; reload the list to show it.
        if (!isKnown) loadContacts();
      }
    });

    return () => socket.disconnect();
  }, [navigate]);

  const searchUsers = useMemo(
    () =>
      debounce(async (q) => {
        // Cancel the previous request so an old response can't overwrite newer results.
        searchAbortRef.current?.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        try {
          const { data } = await api.get("/api/users/search", {
            params: { q },
            signal: controller.signal,
          });
          setResults(data);
        } catch (err) {
          if (err.code !== "ERR_CANCELED") setResults([]);
        } finally {
          if (searchAbortRef.current === controller) setSearching(false);
        }
      }, SEARCH_DELAY),
    []
  );

  const cancelSearch = () => {
    searchUsers.cancel();
    searchAbortRef.current?.abort();
  };

  // Stop any waiting or running search when leaving the page.
  useEffect(() => cancelSearch, []);

  const handleSearchChange = (e, value, reason) => {
    // Picking a user is handled by handleSelectUser, which also clears the box.
    if (reason === "selectOption") return;

    setSearch(value);
    const q = value.trim();

    if (!q) {
      cancelSearch();
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchUsers(q);
  };

  const handleSelectUser = (e, selected) => {
    if (!selected) return;
    handleSearchChange(e, "");
    createContact(selected._id);
  };

  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  const openChat = (contact) => {
    setActiveContact(contact);
    setMessage("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = message.trim();
    setMessage("")
    if (!text) return;
    socketRef.current.emit("send_message", { to: activeContact._id, message: text }, (res) => {
      if (res?.ok) setMessage("");
    });
  };

  const closeMenu = () => setMenuAnchor(null);

  const handleLogout = async () => {
    closeMenu();
    try {
      await api.post("/api/auth/logout");
      navigate("/login", { replace: true });
    } catch {
      // Stay on the page if the server could not log us out.
    }
  };

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ChatLogo />

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 2 }}>
            <Autocomplete
              sx={{ width: "100%", maxWidth: 480 }}
              options={results}
              loading={searching}
              filterOptions={(options) => options}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={null}
              onChange={handleSelectUser}
              inputValue={search}
              onInputChange={handleSearchChange}
              noOptionsText={search.trim() ? "No users found" : "Type a name to search"}
              renderOption={({ key, ...props }, option) => (
                <Box component="li" key={key} {...props}>
                  <UserInfo user={option} avatarSize={32} />
                </Box>
              )}
              renderInput={(params) => (
                <Box
                  ref={params.slotProps.input.ref}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: "rgba(255, 255, 255, 0.15)",
                    "&:hover, &:focus-within": { bgcolor: "rgba(255, 255, 255, 0.25)" },
                  }}
                >
                  <SvgIcon fontSize="small">
                    <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </SvgIcon>
                  <InputBase
                    inputProps={params.slotProps.htmlInput}
                    placeholder="Search or start a new chat"
                    fullWidth
                    sx={{ color: "inherit", fontSize: 14, "& ::placeholder": { color: "inherit", opacity: 0.8 } }}
                  />
                </Box>
              )}
            />
          </Box>

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Account menu">
            <UserAvatar name={user?.name} sx={{ bgcolor: "primary.dark", width: 36, height: 36 }} />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={closeMenu}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

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
          {contacts.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
              No contacts yet. Search for someone to start a chat.
            </Typography>
          ) : (
            <List disablePadding>
              {contacts.map(({ _id, contact }) => (
                <ListItemButton
                  key={_id}
                  divider
                  selected={activeContact?._id === contact._id}
                  onClick={() => openChat(contact)}
                  sx={{ py: 1.5 }}
                >
                  <UserInfo user={contact} />
                </ListItemButton>
              ))}
            </List>
          )}
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
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1,
                  bgcolor: "background.default",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <IconButton
                  onClick={() => setActiveContact(null)}
                  aria-label="Back to contacts"
                  sx={{ display: { md: "none" } }}
                >
                  <SvgIcon>
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </SvgIcon>
                </IconButton>
                <UserInfo user={activeContact} />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  bgcolor: "background.chat",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                  px: { xs: 2, md: 8 },
                  py: 2,
                }}
              >
                {messages.map(({ message, fromUserId, createdAt }, index) => {
                  const isMine = fromUserId === user?._id;
                  return (
                    <Box
                      key={index}
                      sx={{
                        alignSelf: isMine ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        borderTopRightRadius: isMine ? 0 : 8,
                        borderTopLeftRadius: isMine ? 8 : 0,
                        bgcolor: isMine ? "background.myMessage" : "background.paper",
                        boxShadow: "0 1px 0.5px rgba(0, 0, 0, 0.13)",
                        fontSize: 14,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {message}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", textAlign: "right", fontSize: 11, mt: 0.25 }}
                      >
                        {formatMessageTime(createdAt)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.5, bgcolor: "background.default" }}
              >
                <InputBase
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                  fullWidth
                  sx={{ px: 2, py: 1, bgcolor: "background.paper", borderRadius: 2, fontSize: 14 }}
                />
                <IconButton
                  type="submit"
                  disabled={!message.trim()}
                  aria-label="Send"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": { bgcolor: "primary.main", color: "primary.contrastText", opacity: 0.5 },
                  }}
                >
                  <SvgIcon fontSize="small">
                    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                  </SvgIcon>
                </IconButton>
              </Box>
            </>
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
