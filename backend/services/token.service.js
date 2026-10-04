import jwt from "jsonwebtoken";

export const TOKEN_COOKIE = "token";
export const TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Logout must clear the cookie with the same options it was set with.
// In production the frontend is on a different site, so the cookie must be SameSite=None (which requires Secure).
export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: TOKEN_MAX_AGE,
};

export const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_PRIVATE_KEY, {
    expiresIn: TOKEN_MAX_AGE / 1000,
  });

// Returns the token payload, or throws if the token is missing, invalid or expired.
export const verifyToken = (token) => jwt.verify(token, process.env.JWT_PRIVATE_KEY);
