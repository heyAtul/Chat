import { useState } from "react";
import { Box, IconButton, InputBase, SvgIcon } from "@mui/material";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = text.trim();
    if (!message) return;
    onSend(message);
    setText("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.5, bgcolor: "background.default" }}
    >
      <InputBase
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        fullWidth
        sx={{ px: 2, py: 1, bgcolor: "background.paper", borderRadius: 2, fontSize: 14 }}
      />
      <IconButton
        type="submit"
        disabled={!text.trim()}
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
  );
}
