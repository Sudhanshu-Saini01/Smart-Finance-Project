// server/controllers/goalController.js
import Goal from "../models/Goal.js";

/**
 * @desc    Get all goals for the logged-in user
 * @route   GET /api/goals
 * @access  Private
 */
export const getGoals = async (req, res, next) => {
  try {
    // SECURITY FIX: Only find goals for the current user
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new goal for the logged-in user
 * @route   POST /api/goals
 * @access  Private
 */
export const createGoal = async (req, res, next) => {
  try {
    // Create a new goal, automatically adding the logged-in user's ID
    const newGoal = new Goal({ ...req.body, user: req.user.id });
    const goal = await newGoal.save();
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
};
