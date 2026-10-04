import { List, ListItemButton, Typography } from "@mui/material";
import UserInfo from "./UserInfo.jsx";

export default function ContactList({ contacts, activeContactId, onSelect }) {
  if (contacts.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>
        No contacts yet. Search for someone to start a chat.
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {contacts.map(({ _id, contact }) => (
        <ListItemButton
          key={_id}
          divider
          selected={activeContactId === contact._id}
          onClick={() => onSelect(contact)}
          sx={{ py: 1.5 }}
        >
          <UserInfo user={contact} />
        </ListItemButton>
      ))}
    </List>
  );
}
