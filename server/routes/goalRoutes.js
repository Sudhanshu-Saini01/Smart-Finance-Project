// server/routes/goalRoutes.js
// /----- VERSION V2 -----/

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Goal = require("../models/Goal");
const User = require("../models/User");

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
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

// @route   GET /api/goals
// @desc    Get all of a user's goals
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({
      priority: 1,
      createdAt: -1,
    });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/goals/:id/add-funds
// @desc    Add funds to a goal from an unallocated pool
// @access  Private
router.put("/:id/add-funds", auth, async (req, res) => {
  try {
    const { amount, sourceType } = req.body; // sourceType is 'savings' or 'investments'
    const amountToAdd = parseFloat(amount);
    const goal = await Goal.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!goal || !user) return res.status(404).json({ msg: "Not found" });
    if (goal.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    // 1. Check if funds are available in the selected pool
    if (sourceType === "savings" && user.unallocatedSavings < amountToAdd) {
      return res.status(400).json({ msg: "Insufficient savings funds." });
    }
    if (
      sourceType === "investments" &&
      user.unallocatedInvestments < amountToAdd
    ) {
      return res.status(400).json({ msg: "Insufficient investment funds." });
    }

    // 2. Update the goal
    goal.currentAmount += amountToAdd;
    if (sourceType === "savings") {
      goal.fundingSources.fromSavings += amountToAdd;
      user.unallocatedSavings -= amountToAdd; // 3. Deduct from the pool
    } else if (sourceType === "investments") {
      goal.fundingSources.fromInvestments += amountToAdd;
      user.unallocatedInvestments -= amountToAdd; // 3. Deduct from the pool
    }

    await goal.save();
    await user.save(); // 4. Save the user with the updated pool amount
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
// /----- END VERSION V2 -----/
