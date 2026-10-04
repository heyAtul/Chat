import { AppBar, Box, Toolbar } from "@mui/material";
import AccountMenu from "./AccountMenu.jsx";
import ChatLogo from "./ChatLogo.jsx";
import UserSearch from "./UserSearch.jsx";

export default function ChatHeader({ user, onSelectUser }) {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <ChatLogo />

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 2 }}>
          <UserSearch onSelect={onSelectUser} />
        </Box>

        <AccountMenu user={user} />
      </Toolbar>
    </AppBar>
  );
}
