import { useState } from "react";
import { useNavigate } from "react-router";
import { IconButton, Menu, MenuItem } from "@mui/material";
import api from "../api/axios.js";
import { MoreIcon } from "./Icons.jsx";

export default function AccountMenu() {
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
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Menu" sx={{ color: "chat.icon" }}>
        <MoreIcon />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <MenuItem onClick={closeMenu} sx={{ fontSize: 14.5, color: "chat.text", py: 1.25 }}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ fontSize: 14.5, color: "chat.text", py: 1.25 }}>
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
