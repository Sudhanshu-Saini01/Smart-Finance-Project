// server/controllers/investmentController.js
import Investment from "../models/Investment.js";

/**
 * @desc    Get all investments for the logged-in user
 * @route   GET /api/investments
 * @access  Private
 */
export const getInvestments = async (req, res, next) => {
  try {
    const investments = await Investment.find({ user: req.user.id });
    res.json(investments);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new investment for the logged-in user
 * @route   POST /api/investments
 * @access  Private
 */
export const createInvestment = async (req, res, next) => {
  try {
    const newInvestment = new Investment({ ...req.body, user: req.user.id });
    const investment = await newInvestment.save();
    res.status(201).json(investment);
  } catch (err) {
    next(err);
  }
};
