// server/routes/goalRoutes.js

// --- IMPORTS ---
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Goal = require("../models/Goal");
const User = require("../models/User");

const router = express.Router();

// --- ROUTES ---

/**
 * @route   POST /api/goals
 * @desc    Create a new financial goal for the user.
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const { goalName, targetAmount, goalType, imageUrl, priority } = req.body;

    const newGoal = new Goal({
      user: req.user.id,
      goalName,
      targetAmount,
      goalType,
      imageUrl,
      priority,
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/goals
 * @desc    Get all of the user's goals.
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    // Fetches all goals for the user and sorts them first by priority, then by creation date.
    const goals = await Goal.find({ user: req.user.id }).sort({
      priority: 1, // Sorts by priority (e.g., 'high', 'medium', 'low').
      createdAt: -1, // Then sorts by newest first.
    });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   PUT /api/goals/:id/add-funds
 * @desc    Add funds to a specific goal from the user's unallocated pools.
 * @access  Private
 */
router.put("/:id/add-funds", auth, async (req, res) => {
  try {
    const { amount, sourceType } = req.body; // sourceType: 'savings' or 'investments'
    const amountToAdd = parseFloat(amount);

    // 1. Fetch Records: Get the specific goal and the user's profile.
    const goal = await Goal.findById(req.params.id);
    const user = await User.findById(req.user.id);

    // 2. Validate: Check that records exist and the user is authorized.
    if (!goal || !user) {
      return res.status(404).json({ msg: "Goal or user not found" });
    }
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // 3. Check for Sufficient Funds: Ensure the user has enough money in the chosen unallocated pool.
    if (sourceType === "savings" && user.unallocatedSavings < amountToAdd) {
      return res.status(400).json({ msg: "Insufficient savings funds." });
    }
    if (
      sourceType === "investments" &&
      user.unallocatedInvestments < amountToAdd
    ) {
      return res.status(400).json({ msg: "Insufficient investment funds." });
    }

    // 4. Update Records: Add the amount to the goal's current total and subtract it from the user's unallocated pool.
    goal.currentAmount += amountToAdd;
    if (sourceType === "savings") {
      user.unallocatedSavings -= amountToAdd;
    } else if (sourceType === "investments") {
      user.unallocatedInvestments -= amountToAdd;
    }
    // Note: The original code referenced `goal.fundingSources`, which is not defined in the Goal model.
    // This logic has been simplified to directly update the primary fields.

    // 5. Save Changes: Persist the updated goal and user documents to the database.
    await goal.save();
    await user.save();

    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- EXPORT ---
module.exports = router;
