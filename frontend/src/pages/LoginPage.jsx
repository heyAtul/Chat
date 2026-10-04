import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import api from "../api/axios.js";
import ChatLogo from "../components/ChatLogo.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_RE = /^\d{6}$/;
const FORM_SX = { mt: 4, maxWidth: 384, display: "flex", flexDirection: "column", gap: 2 };

const STATUS_COLOR = {
  connecting: "warning.main",
  connected: "success.main",
  disconnected: "error.main",
  error: "error.main",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sentTo, setSentTo] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const socket = io(BASE_URL);
    socketRef.current = socket;

    socket.on("connect", () => setStatus("connected"));
    socket.on("disconnect", () => setStatus("disconnected"));
    socket.on("connect_error", () => setStatus("error"));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    api
      .get("/api/auth/is-user-authenticated")
      .then(({ data }) => data.authenticated && navigate("/chatlist", { replace: true }))
      .catch(() => {});
  }, [navigate]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const value = email.trim();

    if (!EMAIL_RE.test(value)) return setError("Please enter a valid email");

    setSubmitting(true);
    try {
      await api.post("/api/auth/send-otp", { email: value });
      setSentTo(value);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "Server did not respond");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!OTP_RE.test(otp)) return setError("OTP must be 6 digits");

    setSubmitting(true);
    try {
      await api.post("/api/auth/login", { email: sentTo, otp });
      navigate("/chatlist", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Server did not respond");
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ position: "absolute", insetInline: 0, top: 0, height: 224, bgcolor: "primary.main" }} />

      <Box sx={{ position: "relative", mx: "auto", maxWidth: 896, px: 2, pt: 4 }}>
        <Box sx={{ color: "primary.contrastText" }}>
          <ChatLogo />
        </Box>

        <Paper elevation={3} square sx={{ mt: 4, px: { xs: 3, sm: 7 }, py: 6 }}>
          {!sentTo ? (
            <>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 300 }}>
                Enter your email to start chatting
              </Typography>

              <Box component="form" onSubmit={handleSendOtp} noValidate sx={FORM_SX}>
                <TextField
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button type="submit" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                  Next
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 300 }}>
                Enter the OTP
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                We sent a 6-digit code to {sentTo}
              </Typography>

              <Box component="form" onSubmit={handleVerifyOtp} noValidate sx={FORM_SX}>
                <TextField
                  label="OTP"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 6 } }}
                  required
                  autoFocus
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button type="submit" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                  Verify
                </Button>
              </Box>
            </>
          )}

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
