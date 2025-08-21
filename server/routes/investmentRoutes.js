// server/routes/investmentRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Investment = require("../models/Investment");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// @route   POST /api/investments
// @desc    Create a new investment from the unallocated pool
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { investmentName, investmentType, amountInvested, expectedRoi } =
      req.body;
    const user = await User.findById(req.user.id);

    if (user.unallocatedInvestments < parseFloat(amountInvested)) {
      return res.status(400).json({ msg: "Insufficient investment funds." });
    }

    // 1. Create the new investment
    const newInvestment = new Investment({
      user: user._id,
      investmentName,
      investmentType,
      amountInvested,
      expectedRoi, //----- VERSION V2 -----//
    });
    await newInvestment.save();

    // 2. Deduct from the user's unallocated pool
    user.unallocatedInvestments -= parseFloat(amountInvested);
    await user.save();

    // 3. Create a corresponding transaction for history
    const transaction = new Transaction({
      user: user._id,
      description: `Invested in ${investmentName}`,
      amount: amountInvested,
      // THE FIX IS HERE: The type is now correctly set to 'expense'.
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

// @route   GET /api/investments
// @desc    Get all of a user's investments
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id }).sort({
      startDate: -1,
    });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
