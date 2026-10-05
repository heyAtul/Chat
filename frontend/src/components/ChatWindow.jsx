import { Box, IconButton, Skeleton, SvgIcon } from "@mui/material";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import UserInfo from "./UserInfo.jsx";

// Placeholder bubbles shown while the chat history loads: [width, is it on my side].
const SHIMMER_BUBBLES = [["45%", false], ["30%", true], ["55%", false], ["40%", true], ["25%", true], ["50%", false]];

export default function ChatWindow({ contact, messages, loading, currentUserId, onBack, onSend }) {
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
        {loading
          ? SHIMMER_BUBBLES.map(([width, isMine], index) => (
              <Skeleton
                key={index}
                variant="rounded"
                animation="wave"
                height={40}
                sx={{ width, alignSelf: isMine ? "flex-end" : "flex-start", borderRadius: 2 }}
              />
            ))
          : messages.map(({ message, fromUserData, createdAt }, index) => (
              <MessageBubble
                key={index}
                text={message}
                createdAt={createdAt}
                isMine={fromUserData.id === currentUserId}
              />
            ))}
      </Box>

      <MessageInput onSend={onSend} disabled={loading} />
    </>
  );
}
