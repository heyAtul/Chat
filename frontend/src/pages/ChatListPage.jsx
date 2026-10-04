import { useEffect, useState } from "react";
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import api from "../api/axios.js";
import ChatLogo from "../components/ChatLogo.jsx";

export default function ChatListPage() {
  const [user, setUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    api.get("/api/auth/me").then(({ data }) => setUser(data)).catch(() => {});
  }, []);

  const closeMenu = () => setMenuAnchor(null);

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <ChatLogo />
        <Box sx={{ flexGrow: 1 }} />

        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Account menu">
          <Avatar sx={{ bgcolor: "primary.dark", width: 36, height: 36 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={closeMenu}>Profile</MenuItem>
          <MenuItem onClick={closeMenu}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
