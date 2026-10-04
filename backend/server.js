import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { initSocket } from "./socket.js";

const PORT = Number(process.env.PORT) || 8080;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

const server = createServer(app);
initSocket(server, CLIENT_ORIGIN);

connectDB().then(() => {
  console.log("MongoDB connected");
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
});
