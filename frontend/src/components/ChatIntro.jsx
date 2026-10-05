import { Box, Typography } from "@mui/material";
import { ChatIcon } from "./Icons.jsx";

// Shown on the right when no chat is open, like WhatsApp Web's start screen.
export default function ChatIntro() {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        textAlign: "center",
        bgcolor: "chat.panel",
        borderBottom: "6px solid",
        borderBottomColor: "success.main",
      }}
    >
      <ChatIcon sx={{ fontSize: 140, color: "chat.border" }} />
      <Typography sx={{ mt: 4, fontSize: 32, fontWeight: 300, color: "text.primary" }}>Chat</Typography>
      <Typography sx={{ mt: 2, maxWidth: 460, fontSize: 14, lineHeight: "20px", color: "text.secondary" }}>
        Select a chat to start messaging, or search for someone to start a new chat.
      </Typography>
    </Box>
  );
}
