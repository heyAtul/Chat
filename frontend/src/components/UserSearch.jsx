import { useEffect, useMemo, useRef, useState } from "react";
import { Autocomplete, Box, InputBase, SvgIcon } from "@mui/material";
import debounce from "lodash/debounce";
import api from "../api/axios.js";
import UserInfo from "./UserInfo.jsx";

const SEARCH_DELAY = 300; // ms to wait after the last keystroke before searching

export default function UserSearch({ onSelect }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const abortRef = useRef(null);

  const searchUsers = useMemo(
    () =>
      debounce(async (q) => {
        // Cancel the previous request so an old response can't overwrite newer results.
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
          const { data } = await api.get("/api/users/search", {
            params: { q },
            signal: controller.signal,
          });
          setResults(data);
        } catch (err) {
          if (err.code !== "ERR_CANCELED") setResults([]);
        } finally {
          if (abortRef.current === controller) setSearching(false);
        }
      }, SEARCH_DELAY),
    []
  );

  const cancelSearch = () => {
    searchUsers.cancel();
    abortRef.current?.abort();
  };

  // Stop any waiting or running search when leaving the page.
  useEffect(() => cancelSearch, []);

  const handleSearchChange = (e, value, reason) => {
    // Picking a user is handled by handleSelect, which also clears the box.
    if (reason === "selectOption") return;

    setSearch(value);
    const q = value.trim();

    if (!q) {
      cancelSearch();
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchUsers(q);
  };

  const handleSelect = (e, selected) => {
    if (!selected) return;
    handleSearchChange(e, "");
    onSelect(selected);
  };

  return (
    <Autocomplete
      sx={{ width: "100%", maxWidth: 480 }}
      options={results}
      loading={searching}
      filterOptions={(options) => options}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      value={null}
      onChange={handleSelect}
      inputValue={search}
      onInputChange={handleSearchChange}
      noOptionsText={search.trim() ? "No users found" : "Type a name to search"}
      renderOption={({ key, ...props }, option) => (
        <Box component="li" key={key} {...props}>
          <UserInfo user={option} avatarSize={32} />
        </Box>
      )}
      renderInput={(params) => (
        <Box
          ref={params.slotProps.input.ref}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            bgcolor: "rgba(255, 255, 255, 0.15)",
            "&:hover, &:focus-within": { bgcolor: "rgba(255, 255, 255, 0.25)" },
          }}
        >
          <SvgIcon fontSize="small">
            <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </SvgIcon>
          <InputBase
            inputProps={params.slotProps.htmlInput}
            placeholder="Search or start a new chat"
            fullWidth
            sx={{ color: "inherit", fontSize: 14, "& ::placeholder": { color: "inherit", opacity: 0.8 } }}
          />
        </Box>
      )}
    />
  );
}
