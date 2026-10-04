import { randomInt } from "node:crypto";
import User from "../models/User.js";
import { sendOtpMail } from "../services/mail.service.js";
import { TOKEN_COOKIE, TOKEN_MAX_AGE, signToken, verifyToken } from "../services/token.service.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_RE = /^\d{6}$/;

const normalizeEmail = (email) => String(email ?? "").trim().toLowerCase();

export const sendOtp = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Invalid email address" });

  try {
    let user = await User.findOne({ email });
    if (!user) user = new User({ email, name: email });

    const otp = String(randomInt(100000, 1000000));
    user.otp = otp;
    await user.save();

    await sendOtpMail(email, otp);
    res.json({ message: "OTP sent" });
  } catch (err) {
    console.error("sendOtp failed:", err.message);
    res.status(500).json({ error: "Could not send OTP" });
  }
};

export const login = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const otp = String(req.body?.otp ?? "").trim();
  if (!EMAIL_RE.test(email) || !OTP_RE.test(otp)) {
    return res.status(400).json({ error: "Invalid email or OTP" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user?.otp || user.otp !== otp) return res.status(400).json({ error: "Wrong OTP" });

    user.otp = undefined;
    await user.save();

    res.cookie(TOKEN_COOKIE, signToken(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: TOKEN_MAX_AGE,
    });
    res.json({ message: "Logged in" });
  } catch (err) {
    console.error("login failed:", err.message);
    res.status(500).json({ error: "Could not log in" });
  }
};

export const isUserAuthenticated = (req, res) => {
  try {
    verifyToken(req.cookies[TOKEN_COOKIE]);
    res.json({ authenticated: true });
  } catch {
    res.json({ authenticated: false });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    res.json(user);
  } catch (err) {
    console.error("getMe failed:", err.message);
    res.status(500).json({ error: "Could not load user" });
  }
};
