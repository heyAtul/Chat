import { Box, IconButton, InputBase } from "@mui/material";
import { BackIcon, SearchIcon } from "./Icons.jsx";

export default function SearchBar({ value, onChange }) {
  return (
    <Box sx={{ px: 1.5, py: 0.875, borderBottom: 1, borderColor: "chat.rowDivider" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, height: 35, px: 1.5, borderRadius: 2, bgcolor: "chat.panel" }}>
        {/* Like WhatsApp: the search icon turns into a green back arrow that clears the search. */}
        {value ? (
          <IconButton onClick={() => onChange("")} aria-label="Clear search" sx={{ p: 0, color: "primary.main" }}>
            <BackIcon fontSize="small" />
          </IconButton>
        ) : (
          <SearchIcon fontSize="small" sx={{ color: "chat.icon" }} />
        )}
        <InputBase
          placeholder="Search or start new chat"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
          sx={{ fontSize: 15, color: "chat.text" }}
        />
      </Box>
    </Box>
  );
}
