// server/controllers/loanController.js
const Loan = require("../models/Loan");

// @desc    Get all loans
// @route   GET /api/loans
// @access  Private
const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ emiDate: 1 });
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new loan
// @route   POST /api/loans
// @access  Private
const createLoan = async (req, res) => {
  try {
    const newLoan = new Loan(req.body);
    const loan = await newLoan.save();
    res.status(201).json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Failed to create loan" });
  }
};

module.exports = {
  getLoans,
  createLoan,
};
