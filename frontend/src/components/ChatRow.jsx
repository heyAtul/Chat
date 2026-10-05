import { Box, ListItemButton, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar.jsx";

// One row of the left panel: avatar, name and email, with an inset divider like WhatsApp.
export default function ChatRow({ user, selected, onClick }) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      sx={{
        height: 72,
        pl: 1.5,
        pr: 0,
        gap: 1.5,
        "&:hover": { bgcolor: "chat.rowHover" },
        "&.Mui-selected, &.Mui-selected:hover": { bgcolor: "chat.rowSelected" },
      }}
    >
      <UserAvatar name={user.name} sx={{ width: 49, height: 49, fontSize: 20 }} />
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          pr: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottom: 1,
          borderColor: "chat.rowDivider",
        }}
      >
        <Typography noWrap sx={{ fontSize: 17, lineHeight: "21px", color: "chat.text" }}>
          {user.name}
        </Typography>
        <Typography noWrap sx={{ fontSize: 14, lineHeight: "20px", color: "text.secondary" }}>
          {user.email}
        </Typography>
      </Box>
    </ListItemButton>
  );
}
