import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";

const PORT = Number(process.env.PORT) || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

io.on("connection", (socket) => {});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
