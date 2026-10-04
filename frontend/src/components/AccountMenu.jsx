import { useState } from "react";
import { useNavigate } from "react-router";
import { IconButton, Menu, MenuItem } from "@mui/material";
import api from "../api/axios.js";
import UserAvatar from "./UserAvatar.jsx";

export default function AccountMenu({ user }) {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const closeMenu = () => setAnchor(null);

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
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Account menu">
        <UserAvatar name={user?.name} sx={{ bgcolor: "primary.dark", width: 36, height: 36 }} />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={closeMenu}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
