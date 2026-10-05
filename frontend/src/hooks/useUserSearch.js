import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import api from "../api/axios.js";

const SEARCH_DELAY = 300; // ms to wait after the last keystroke before searching

export default function useUserSearch() {
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

  const changeSearch = (value) => {
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

  return { search, results, searching, changeSearch };
}
