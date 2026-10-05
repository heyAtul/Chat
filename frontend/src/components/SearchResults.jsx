import { List, Typography } from "@mui/material";
import ChatRow from "./ChatRow.jsx";

const messageSx = { p: 4, textAlign: "center", fontSize: 14, color: "text.secondary" };

export default function SearchResults({ results, searching, onSelect }) {
  if (searching) return <Typography sx={messageSx}>Searching…</Typography>;
  if (results.length === 0) return <Typography sx={messageSx}>No users found</Typography>;

  return (
    <>
      <Typography sx={{ px: 4, pt: 3, pb: 1.5, fontSize: 16, color: "primary.dark" }}>USERS</Typography>
      <List disablePadding>
        {results.map((user) => (
          <ChatRow key={user._id} user={user} onClick={() => onSelect(user)} />
        ))}
      </List>
    </>
  );
}
