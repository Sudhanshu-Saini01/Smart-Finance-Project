// server/routes/investmentRoutes.js

// --- IMPORTS ---
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

// --- ROUTES ---

/**
 * @route   POST /api/investments
 * @desc    Create a new investment, deducting the amount from the user's unallocated pool.
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const { investmentName, investmentType, amountInvested, expectedRoi } =
      req.body;

    // 1. Fetch User & Validate Funds: Get the user's data and ensure they have enough unallocated investment funds.
    const user = await User.findById(req.user.id);
    if (user.unallocatedInvestments < amountInvested) {
      return res.status(400).json({ msg: "Insufficient investment funds." });
    }

    // 2. Create New Investment: Create the new investment record.
    const newInvestment = new Investment({
      user: user._id,
      investmentName,
      investmentType,
      amountInvested,
      expectedRoi,
    });
    await newInvestment.save();

    // 3. Update User's Pool: Deduct the invested amount from the user's unallocated funds.
    user.unallocatedInvestments -= parseFloat(amountInvested);
    await user.save();

    // 4. Create Transaction Record: Log this action as a formal transaction.
    const transaction = new Transaction({
      user: user._id,
      description: `Invested in ${investmentName}`,
      amount: amountInvested,
      type: "investment",
      category: investmentType,
    });
    await transaction.save();

    res.status(201).json(newInvestment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/investments
 * @desc    Get all of the user's investments, sorted by most recent.
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id }).sort({
      startDate: -1, // Sorts in descending order (newest first).
    });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- EXPORT ---
module.exports = router;
