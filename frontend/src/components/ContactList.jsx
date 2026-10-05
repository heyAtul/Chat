import { List, Typography } from "@mui/material";
import ChatRow from "./ChatRow.jsx";

export default function ContactList({ contacts, activeContactId, onSelect }) {
  if (contacts.length === 0) {
    return (
      <Typography sx={{ p: 4, textAlign: "center", fontSize: 14, color: "text.secondary" }}>
        No chats yet. Search for someone to start a new chat.
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {contacts.map(({ _id, contact }) => (
        <ChatRow
          key={_id}
          user={contact}
          selected={activeContactId === contact._id}
          onClick={() => onSelect(contact)}
        />
      ))}
    </List>
  );
}
