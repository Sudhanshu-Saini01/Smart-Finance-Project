// server/controllers/goalController.js

const Goal = require("../models/Goal");

// @desc    Get all financial goals
// @route   GET /api/goals
// @access  Public (for now)
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error("Error fetching goals:", err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new financial goal
// @route   POST /api/goals
// @access  Public (for now)
const createGoal = async (req, res) => {
  try {
    const newGoal = new Goal({
      goalName: req.body.goalName,
      targetAmount: req.body.targetAmount,
      goalType: req.body.goalType,
      priority: req.body.priority,
      imageUrl: req.body.imageUrl,
    });

    const goal = await newGoal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error("Error creating goal:", err.message);
    res.status(500).send("Server Error");
  }
};

// Export the functions to be used in our routes
module.exports = {
  getGoals,
  createGoal,
};
