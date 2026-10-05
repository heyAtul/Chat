import { Box } from "@mui/material";

// A WhatsApp-style bubble. The first message of a group gets a tail and a square top corner.
export default function MessageBubble({ text, time, isMine, showTail }) {
  const color = isMine ? "chat.bubbleOut" : "chat.bubbleIn";

  return (
    <Box
      sx={{
        position: "relative",
        alignSelf: isMine ? "flex-end" : "flex-start",
        maxWidth: { xs: "85%", md: "65%" },
        mt: showTail ? 1.5 : 0.25,
        px: 1,
        pt: 0.75,
        pb: 1,
        borderRadius: "7.5px",
        bgcolor: color,
        boxShadow: "0 1px 0.5px rgba(11, 20, 26, 0.13)",
        color: "chat.text",
        fontSize: 14.2,
        lineHeight: "19px",
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        ...(showTail && {
          [isMine ? "borderTopRightRadius" : "borderTopLeftRadius"]: 0,
          // The tail: a small triangle sticking out of the top corner.
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            width: 0,
            height: 0,
            borderBottom: "8px solid transparent",
            ...(isMine
              ? { right: -8, borderLeft: "8px solid", borderLeftColor: color }
              : { left: -8, borderRight: "8px solid", borderRightColor: color }),
          },
        }),
      }}
    >
      {text}
      {/* Empty space at the end of the text, so the time never covers the last line. */}
      <Box component="span" sx={{ display: "inline-block", width: 58 }} />
      <Box
        component="span"
        sx={{ position: "absolute", right: 7, bottom: 3, fontSize: 11, lineHeight: "15px", color: "text.secondary" }}
      >
        {time}
      </Box>
    </Box>
  );
}
