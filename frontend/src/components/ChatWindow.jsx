import { Fragment, useEffect, useRef } from "react";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { formatDayLabel, formatMessageTime, isSameDay } from "../utils/messageTime.js";
import { BackIcon } from "./Icons.jsx";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import UserAvatar from "./UserAvatar.jsx";

// Placeholder bubbles shown while the chat history loads: [width, is it on my side].
const SHIMMER_BUBBLES = [["45%", false], ["30%", true], ["55%", false], ["40%", true], ["25%", true], ["50%", false]];

export default function ChatWindow({ contact, messages, loading, currentUserId, onBack, onSend }) {
  const bottomRef = useRef(null);

  // Like WhatsApp, always show the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <>
      <Box
        sx={{
          height: 59,
          flexShrink: 0,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "chat.panel",
        }}
      >
        {/* Back button only shows on phones, where the list and chat don't fit side by side. */}
        <IconButton onClick={onBack} aria-label="Back to chats" sx={{ display: { md: "none" }, ml: -1, color: "chat.icon" }}>
          <BackIcon />
        </IconButton>
        <UserAvatar name={contact.name} sx={{ width: 40, height: 40 }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: 16, lineHeight: "21px", color: "chat.text" }}>
            {contact.name}
          </Typography>
          <Typography noWrap sx={{ fontSize: 13, lineHeight: "20px", color: "text.secondary" }}>
            {contact.email}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "chat.wallpaper",
          display: "flex",
          flexDirection: "column",
          px: { xs: 2, md: "8%" },
          py: 1.5,
        }}
      >
        {loading
          ? SHIMMER_BUBBLES.map(([width, isMine], index) => (
              <Skeleton
                key={index}
                variant="rounded"
                animation="wave"
                height={34}
                sx={{ width, mt: 1.5, alignSelf: isMine ? "flex-end" : "flex-start", borderRadius: "7.5px" }}
              />
            ))
          : messages.map((msg, index) => {
              const prev = messages[index - 1];
              const isNewDay = !prev || !isSameDay(prev.createdAt, msg.createdAt);
              // A new group starts on a new day or when the sender changes; only its first bubble has a tail.
              const startsGroup = isNewDay || prev.fromUserData.id !== msg.fromUserData.id;

              return (
                <Fragment key={index}>
                  {isNewDay && (
                    <Box
                      sx={{
                        alignSelf: "center",
                        mt: 1.5,
                        mb: 0.5,
                        px: 1.5,
                        py: 0.625,
                        borderRadius: "7.5px",
                        bgcolor: "background.paper",
                        boxShadow: "0 1px 0.5px rgba(11, 20, 26, 0.13)",
                        fontSize: 12.5,
                        color: "chat.icon",
                      }}
                    >
                      {formatDayLabel(msg.createdAt)}
                    </Box>
                  )}
                  <MessageBubble
                    text={msg.message}
                    time={formatMessageTime(msg.createdAt)}
                    isMine={msg.fromUserData.id === currentUserId}
                    showTail={startsGroup}
                  />
                </Fragment>
              );
            })}
        <div ref={bottomRef} />
      </Box>

      <MessageInput onSend={onSend} disabled={loading} />
    </>
  );
}
