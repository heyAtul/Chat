import User from "../models/User.js";

const SEARCH_LIMIT = 10;

// Escape regex special characters so the search text is matched literally.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchUsers = async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json([]);

  try {
    const users = await User.find({
      _id: { $ne: req.userId },
      name: { $regex: escapeRegex(q), $options: "i" },
    })
      .select("name email")
      .limit(SEARCH_LIMIT);
    res.json(users);
  } catch (err) {
    console.error("searchUsers failed:", err.message);
    res.status(500).json({ error: "Could not search users" });
  }
};
