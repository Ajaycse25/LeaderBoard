import express from "express";
import User from "../models/User.js";
import { assignRanks } from "../utils/ranking.js";

const router = express.Router();

// List all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a user
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Name is required" });
    const nameTrim = name.trim();
    const exists = await User.findOne({ name: nameTrim });
    if (exists) return res.status(409).json({ error: "User with this name already exists" });
    const user = await User.create({ name: nameTrim });

    // emit updated leaderboard
    const io = req.app.locals.io;
    const leaderboardUsers = await User.find().sort({ totalPoints: -1, name: 1 });
    io.emit("leaderboard:update", assignRanks(leaderboardUsers));

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaderboard
router.get("/leaderboard", async (_req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1, name: 1 });
    res.json(assignRanks(users));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
