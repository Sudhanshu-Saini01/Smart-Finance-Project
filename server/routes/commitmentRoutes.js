// server/routes/commitmentRoutes.js
//-------- Start: Version V3.0.0---------//

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Commitment = require("../models/Commitment");

const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const Investment = require("../models/Investment");

// @route   POST /api/commitments
// @desc    Create a new financial commitment
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const {
      commitmentName,
      amount,
      commitmentType,
      paymentDay,
      linkedGoal,
      linkedLoan,
      linkedInvestment,
    } = req.body;

    const newCommitment = new Commitment({
      user: req.user.id,
      commitmentName,
      amount,
      commitmentType,
      paymentDay,
      linkedGoal,
      linkedLoan,
      linkedInvestment,
    });

    const savedCommitment = await newCommitment.save();
    res.status(201).json(savedCommitment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/commitments
// @desc    Get all of a user's financial commitments
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const commitments = await Commitment.find({ user: req.user.id }).sort({
      paymentDay: 1,
    });
    res.json(commitments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// NEW ENDPOINT: Get upcoming payments based on a simulated date
router.get("/upcoming", auth, async (req, res) => {
  try {
    const { currentDate } = req.query;
    const simDate = new Date(currentDate);
    const commitments = await Commitment.find({
      user: req.user.id,
      frequency: { $ne: "one-time" },
    });

    const upcoming = commitments.filter((c) => {
      const lastPaid = c.lastExecutionDate || c.startDate;
      let nextDueDate = new Date(lastPaid);

      switch (c.frequency) {
        case "daily":
          nextDueDate.setDate(nextDueDate.getDate() + 1);
          break;
        case "weekly":
          nextDueDate.setDate(nextDueDate.getDate() + 7);
          break;
        case "monthly":
          nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          break;
        case "quarterly":
          nextDueDate.setMonth(nextDueDate.getMonth() + 3);
          break;
        case "yearly":
          nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
          break;
        default:
          return false;
      }
      return nextDueDate <= simDate;
    });

    res.json(upcoming);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// NEW ENDPOINT: Execute a specific commitment
router.post("/:id/execute", auth, async (req, res) => {
  try {
    const commitment = await Commitment.findById(req.params.id);
    if (!commitment || commitment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Commitment not found" });
    }

    // 1. Create the transaction
    const newTransaction = new Transaction({
      user: req.user.id,
      description: commitment.commitmentName,
      amount: commitment.amount,
      type: commitment.commitmentType,
      category: "Recurring Commitment",
      date: new Date(req.body.executionDate), // Use the simulated date
    });
    await newTransaction.save();

    // 2. Update linked items
    if (commitment.linkedGoal)
      await Goal.findByIdAndUpdate(commitment.linkedGoal, {
        $inc: { currentAmount: commitment.amount },
      });
    if (commitment.linkedLoan)
      await Loan.findByIdAndUpdate(commitment.linkedLoan, {
        $inc: { amountPaid: commitment.amount },
      });
    if (commitment.linkedInvestment)
      await Investment.findByIdAndUpdate(commitment.linkedInvestment, {
        $inc: { amountInvested: commitment.amount },
      });

    // 3. Update the commitment's last execution date
    commitment.lastExecutionDate = new Date(req.body.executionDate);
    await commitment.save();

    res.json({ msg: "Commitment executed successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
//-------- End: Version V3.0.0---------//
