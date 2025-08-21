// server/routes/loanRoutes.js
// /----- VERSION V2 -----/

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Loan = require("../models/Loan");

// @route   POST /api/loans
// @desc    Add a new loan
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const {
      loanName,
      lender,
      loanType,
      assetType,
      totalAmount,
      emi,
      interestRate,
      startDate,
      endDate,
    } = req.body;

    const newLoan = new Loan({
      user: req.user.id,
      loanName,
      lender,
      loanType,
      assetType,
      totalAmount,
      emi,
      interestRate,
      startDate,
      endDate,
    });

    const savedLoan = await newLoan.save();
    res.status(201).json(savedLoan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/loans
// @desc    Get all of a user's active loans
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id, status: "active" }).sort(
      { endDate: 1 }
    ); // Sort by which ends soonest
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
// /----- END VERSION V2 -----/
