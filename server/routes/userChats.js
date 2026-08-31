import express from "express";
import UserChats from "../models/userChats.js";
import requireAuth from "../middlewares/clerkAuth.js";

const router = express.Router();

/**
 * GET /api/userchats
 * Returns the authenticated user's list of chats (for the sidebar).
 */
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req;

  try {
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      return res.json({ chats: [] });
    }

    // Return chats in reverse chronological order
    const sorted = [...userChats.chats].reverse();
    res.json({ chats: sorted });
  } catch (err) {
    console.error("GET /api/userchats error:", err);
    res.status(500).json({ error: "Failed to fetch user chats." });
  }
});

export default router;
