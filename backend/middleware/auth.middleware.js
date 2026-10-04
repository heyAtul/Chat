import { TOKEN_COOKIE, verifyToken } from "../services/token.service.js";

export const requireAuth = (req, res, next) => {
  try {
    req.userId = verifyToken(req.cookies[TOKEN_COOKIE]).id;
    next();
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};

// Socket.IO version of requireAuth. Needs cookieParser on io.engine so cookies are parsed.
export const requireSocketAuth = (socket, next) => {
  try {
    socket.data.userId = verifyToken(socket.request.cookies?.[TOKEN_COOKIE]).id;
    socket.data.userData = verifyToken(socket.request.cookies?.[TOKEN_COOKIE])
    next();
  } catch {
    next(new Error("Not authenticated"));
  }
};
