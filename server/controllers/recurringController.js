// server/controllers/recurringController.js
import Recurring from "../models/Recurring.js";

/**
 * @desc    Get all recurring items for the logged-in user
 * @route   GET /api/recurrings
 * @access  Private
 */
const getRecurrings = async (req, res, next) => {
  try {
    const recurrings = await Recurring.find({ user: req.user.id });
    res.json(recurrings);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new recurring item for the logged-in user
 * @route   POST /api/recurrings
 * @access  Private
 */
const createRecurring = async (req, res, next) => {
  try {
    const newRecurring = new Recurring({ ...req.body, user: req.user.id });
    const savedRecurring = await newRecurring.save();
    res.status(201).json(savedRecurring);
  } catch (err) {
    next(err);
  }
};

// Export both functions
export { getRecurrings, createRecurring };
