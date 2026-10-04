import { Box, Typography } from "@mui/material";
import UserAvatar from "./UserAvatar.jsx";

export default function UserInfo({ user, avatarSize = 40 }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
      <UserAvatar
        name={user.name}
        sx={{ width: avatarSize, height: avatarSize, fontSize: avatarSize * 0.45 }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.primary" noWrap>
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="p">
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
}
