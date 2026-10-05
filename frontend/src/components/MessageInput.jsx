import { useState } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import { SendIcon } from "./Icons.jsx";

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message || disabled) return;
    onSend(message);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 62, px: 2, py: 0.625, bgcolor: "chat.panel" }}
    >
      <InputBase
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        sx={{ flex: 1, px: 1.5, py: 1.125, bgcolor: "background.paper", borderRadius: 2, fontSize: 15, color: "chat.text" }}
      />
      <IconButton type="submit" disabled={disabled || !text.trim()} aria-label="Send" sx={{ color: "chat.icon" }}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}
