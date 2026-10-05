import { Box } from "@mui/material";
import useUserSearch from "../hooks/useUserSearch.js";
import AccountMenu from "./AccountMenu.jsx";
import ContactList from "./ContactList.jsx";
import SearchBar from "./SearchBar.jsx";
import SearchResults from "./SearchResults.jsx";
import UserAvatar from "./UserAvatar.jsx";

// Left panel: my avatar and menu, the search bar, then my chats (or search results while typing).
export default function Sidebar({ user, contacts, activeContactId, onSelectContact, onSelectUser }) {
  const { search, results, searching, changeSearch } = useUserSearch();

  const handleSelectUser = (selected) => {
    changeSearch("");
    onSelectUser(selected);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "background.paper" }}>
      <Box
        sx={{
          height: 59,
          flexShrink: 0,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "chat.panel",
        }}
      >
        <UserAvatar name={user?.name} sx={{ width: 40, height: 40 }} />
        <AccountMenu />
      </Box>

      <SearchBar value={search} onChange={changeSearch} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {search.trim() ? (
          <SearchResults results={results} searching={searching} onSelect={handleSelectUser} />
        ) : (
          <ContactList contacts={contacts} activeContactId={activeContactId} onSelect={onSelectContact} />
        )}
      </Box>
    </Box>
  );
}
