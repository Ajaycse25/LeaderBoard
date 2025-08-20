import express from "express";
import User from "../models/User.js";
import ClaimHistory from "../models/ClaimHistory.js";
import { assignRanks } from "../utils/ranking.js";

const router = express.Router();

// Claim random points (1..10) for a user
router.post("/", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const points = Math.floor(Math.random() * 10) + 1; // 1..10
    user.totalPoints += points;
    await user.save();

    const history = await ClaimHistory.create({ user: user._id, points });

    // Emit update leaderboard + new history item
    const io = req.app.locals.io;
    const leaderboardUsers = await User.find().sort({ totalPoints: -1, name: 1 });
    io.emit("leaderboard:update", assignRanks(leaderboardUsers));
    io.emit("history:new", { 
      _id: history._id, 
      user: user._id.toString(), 
      points, 
      createdAt: history.createdAt 
    });

    res.json({
      message: "Points claimed",
      user: { _id: user._id, name: user.name, totalPoints: user.totalPoints },
      points,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get claim history
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { user: userId } : {};
    const items = await ClaimHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
