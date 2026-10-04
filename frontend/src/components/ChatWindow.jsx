import { Box, IconButton, SvgIcon } from "@mui/material";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import UserInfo from "./UserInfo.jsx";

export default function ChatWindow({ contact, messages, currentUserId, onBack, onSend }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {/* Back button only shows on phones, where the list and chat don't fit side by side. */}
        <IconButton onClick={onBack} aria-label="Back to contacts" sx={{ display: { md: "none" } }}>
          <SvgIcon>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </SvgIcon>
        </IconButton>
        <UserInfo user={contact} />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          bgcolor: "background.chat",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          px: { xs: 2, md: 8 },
          py: 2,
        }}
      >
        {messages.map(({ message, fromUserId, createdAt }, index) => (
          <MessageBubble
            key={index}
            text={message}
            createdAt={createdAt}
            isMine={fromUserId === currentUserId}
          />
        ))}
      </Box>

      <MessageInput onSend={onSend} />
    </>
  );
}
