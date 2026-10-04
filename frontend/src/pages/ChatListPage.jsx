import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  SvgIcon,
  Toolbar,
  Typography,
} from "@mui/material";
import { io } from "socket.io-client";
import debounce from "lodash/debounce";
import api from "../api/axios.js";
import ChatLogo from "../components/ChatLogo.jsx";

const SEARCH_DELAY = 300; // ms to wait after the last keystroke before searching

const getInitial = (name) => name?.[0]?.toUpperCase();

export default function ChatListPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchAbortRef = useRef(null);

  useEffect(() => {
    api.get("/api/auth/me").then(({ data }) => setUser(data)).catch(() => {});
  }, []);

  useEffect(() => {
    // withCredentials sends the httpOnly token cookie, which the server checks before accepting
    const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });

    socket.on("connect_error", (err) => {
      if (err.message === "Not authenticated") navigate("/login", { replace: true });
    });

    return () => socket.disconnect();
  }, [navigate]);

  const searchUsers = useMemo(
    () =>
      debounce(async (q) => {
        // Cancel the previous request so an old response can't overwrite newer results.
        searchAbortRef.current?.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        try {
          const { data } = await api.get("/api/users/search", {
            params: { q },
            signal: controller.signal,
          });
          setResults(data);
        } catch (err) {
          if (err.code !== "ERR_CANCELED") setResults([]);
        } finally {
          if (searchAbortRef.current === controller) setSearching(false);
        }
      }, SEARCH_DELAY),
    []
  );

  const cancelSearch = () => {
    searchUsers.cancel();
    searchAbortRef.current?.abort();
  };

  // Stop any waiting or running search when leaving the page.
  useEffect(() => cancelSearch, []);

  const handleSearchChange = (e, value) => {
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

  const closeMenu = () => setMenuAnchor(null);

  const handleLogout = async () => {
    closeMenu();
    try {
      await api.post("/api/auth/logout");
      navigate("/login", { replace: true });
    } catch {
      // Stay on the page if the server could not log us out.
    }
  };

  return (
    <Box>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ChatLogo />

          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 2 }}>
            <Autocomplete
              sx={{ width: "100%", maxWidth: 480 }}
              options={results}
              loading={searching}
              filterOptions={(options) => options}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              inputValue={search}
              onInputChange={handleSearchChange}
              noOptionsText={search.trim() ? "No users found" : "Type a name to search"}
              renderOption={({ key, ...props }, option) => (
                <Box component="li" key={key} {...props} sx={{ display: "flex", gap: 1.5 }}>
                  <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.main" }}>
                    {getInitial(option.name)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" noWrap>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {option.email}
                    </Typography>
                  </Box>
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
          </Box>

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label="Account menu">
            <Avatar sx={{ bgcolor: "primary.dark", width: 36, height: 36 }}>
              {getInitial(user?.name)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={closeMenu}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
