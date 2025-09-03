// server/controllers/loanController.js
import Loan from "../models/Loan.js";

/**
 * @desc    Get all loans for the logged-in user
 * @route   GET /api/loans
 * @access  Private
 */
export const getLoans = async (req, res, next) => {
  try {
    // SECURITY FIX: Only find loans for the current user
    const loans = await Loan.find({ user: req.user.id });
    res.json(loans);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new loan for the logged-in user
 * @route   POST /api/loans
 * @access  Private
 */
export const createLoan = async (req, res, next) => {
  try {
    // Create a new loan, automatically adding the logged-in user's ID
    const newLoan = new Loan({ ...req.body, user: req.user.id });
    const loan = await newLoan.save();
    res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
};
