import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Alert, Box, Button, Paper, SvgIcon, TextField, Typography } from "@mui/material";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_COLOR = {
  connecting: "warning.main",
  connected: "success.main",
  disconnected: "error.main",
  error: "error.main",
};

export default function LoginPage() {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [joinedEmail, setJoinedEmail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const socket = io(BASE_URL);
    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => setStatus("error"));

    return () => socket.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();

    if (!EMAIL_RE.test(value)) return setError("Please enter a valid email");
    if (!socketRef.current?.connected) return setError("Not connected to server");

    setSubmitting(true);
    try {
      const res = await socketRef.current.timeout(5000).emitWithAck("join", value);
      if (res.ok) {
        setJoinedEmail(res.email);
        setError("");
      } else {
        setError(res.error);
      }
    } catch {
      setError("Server did not respond");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ position: "absolute", insetInline: 0, top: 0, height: 224, bgcolor: "primary.main" }} />

      <Box sx={{ position: "relative", mx: "auto", maxWidth: 896, px: 2, pt: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "primary.contrastText" }}>
          <ChatIcon />
          <Typography variant="subtitle2" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
            Chat
          </Typography>
        </Box>

        <Paper elevation={3} square sx={{ mt: 4, px: { xs: 3, sm: 7 }, py: 6 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 300 }}>
            Enter your email to start chatting
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 4, maxWidth: 384, display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              type="email"
              label="Email"
              placeholder="you@example.com"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              fullWidth
            />

            {error && <Alert severity="error">{error}</Alert>}
            {joinedEmail && <Alert severity="success">Joined as {joinedEmail}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={status !== "connected" || submitting}
              sx={{
                alignSelf: "flex-start",
                borderRadius: 999,
                px: 3,
                textTransform: "none",
              }}
            >
              Next
            </Button>
          </Box>

          <Box sx={{ mt: 5, display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLOR[status] }} />
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
              {status}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

function ChatIcon() {
  return (
    <SvgIcon fontSize="large">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.58 2.77 6.19L4 22l4.97-2.13c.97.27 1.99.42 3.03.42 5.52 0 10-4.03 10-9S17.52 2 12 2z" />
    </SvgIcon>
  );
}
