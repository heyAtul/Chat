import { TOKEN_COOKIE, verifyToken } from "../services/token.service.js";

export const requireAuth = (req, res, next) => {
  try {
    req.userId = verifyToken(req.cookies[TOKEN_COOKIE]).id;
    next();
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
};
