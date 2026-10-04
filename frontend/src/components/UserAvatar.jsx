import { Avatar } from "@mui/material";

export default function UserAvatar({ name, sx }) {
  return <Avatar sx={{ bgcolor: "primary.main", ...sx }}>{name?.[0]?.toUpperCase()}</Avatar>;
}
