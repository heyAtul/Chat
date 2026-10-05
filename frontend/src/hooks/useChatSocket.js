import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

// Connects to the chat server and calls onMessage for every received message.
export default function useChatSocket(onMessage) {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  // The socket listener is set up once, so it calls the latest handler through a ref.
  // That way the handler always sees current state, not the values from the first render.
  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    // withCredentials sends the httpOnly token cookie, which the server checks before accepting
    const socket = io(import.meta.env.VITE_BASE_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      if (err.message === "Not authenticated") navigate("/login", { replace: true });
    });

    socket.on("receive_message", (msg) => onMessageRef.current(msg));

    return () => socket.disconnect();
  }, [navigate]);

  const sendMessage = (to, message) => socketRef.current?.emit("send_message", { toUserId: to, message });

  return { sendMessage };
}
