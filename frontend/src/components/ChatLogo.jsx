import { Box, Typography } from "@mui/material";
import { ChatIcon } from "./Icons.jsx";

export default function ChatLogo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <ChatIcon fontSize="large" />
      <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
        Chat
      </Typography>
    </Box>
  );
}
