import { Box, Typography } from "@mui/material";

// e.g. "03:45 PM - 04/09/2071" (time, then date as DD/MM/YYYY)
const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${time} - ${date.toLocaleDateString("en-GB")}`;
};

export default function MessageBubble({ text, createdAt, isMine }) {
  return (
    <Box
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
      {text}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", textAlign: "right", fontSize: 11, mt: 0.25 }}
      >
        {formatMessageTime(createdAt)}
      </Typography>
    </Box>
  );
}
