import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_DOT = {
  connecting: "bg-amber-400",
  connected: "bg-[#25d366]",
  disconnected: "bg-red-500",
  error: "bg-red-500",
};

export default function LoginPage() {
  const socketRef = useRef(null);
  const [status, setStatus] = useState("connecting");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [joinedEmail, setJoinedEmail] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);
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
    <div className="relative min-h-screen bg-[#f0f2f5]">
      <div className="absolute inset-x-0 top-0 h-56 bg-[#00a884]" />

      <div className="relative mx-auto max-w-4xl px-4 pt-8">
        <div className="flex items-center gap-2 text-white">
          <ChatIcon />
          <span className="text-sm font-medium uppercase tracking-wide">Chat</span>
        </div>

        <div className="mt-8 rounded-sm bg-white px-6 py-12 shadow-md sm:px-14">
          <h1 className="text-2xl font-light text-[#41525d] sm:text-3xl">
            Enter your email to start chatting
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 flex max-w-sm flex-col gap-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="border-b-2 border-[#00a884] px-1 py-2 text-[#111b21] placeholder:text-[#8696a0] focus:outline-none"
            />

            {error && <p className="text-sm text-red-600">{error}</p>}
            {joinedEmail && (
              <p className="text-sm text-[#008069]">Joined as {joinedEmail}</p>
            )}

            <button
              type="submit"
              disabled={status !== "connected" || submitting}
              className="self-start rounded-full bg-[#00a884] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#008f6f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </form>

          <p className="mt-10 flex items-center gap-2 text-xs capitalize text-[#667781]">
            <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
      <path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.58 2.77 6.19L4 22l4.97-2.13c.97.27 1.99.42 3.03.42 5.52 0 10-4.03 10-9S17.52 2 12 2z" />
    </svg>
  );
}
