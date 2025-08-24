// server/routes/commitmentRoutes.js

// --- IMPORTS ---
const express = require("express");
const auth = require("../middleware/authMiddleware");
const Commitment = require("../models/Commitment");
const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const Investment = require("../models/Investment");

const router = express.Router();

// --- ROUTES ---

/**
 * @route   POST /api/commitments
 * @desc    Create a new recurring commitment for the user.
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      commitmentName,
      amount,
      commitmentType,
      frequency,
      startDate,
      linkedGoal,
    } = req.body;

    const newCommitment = new Commitment({
      user: req.user.id,
      commitmentName,
      amount,
      commitmentType,
      frequency,
      startDate,
      linkedGoal,
    });

    const savedCommitment = await newCommitment.save();
    res.status(201).json(savedCommitment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/commitments
 * @desc    Get all of the user's commitments, sorted by start date.
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const commitments = await Commitment.find({ user: req.user.id }).sort({
      startDate: 1, // Sorts in ascending order (oldest first).
    });
    res.json(commitments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/commitments/upcoming
 * @desc    Calculates and returns which commitments are due based on a simulated date.
 * @access  Private
 */
router.get("/upcoming", auth, async (req, res) => {
  try {
    // 1. Get Simulated Date: Use the date provided by the client to check for due payments.
    const simDate = new Date(req.query.currentDate);
    simDate.setHours(23, 59, 59, 999); // Set to the end of the day for accurate comparison.

    // 2. Fetch Commitments: Get all of the user's recurring commitments.
    const commitments = await Commitment.find({ user: req.user.id });

    // 3. Filter for Due Commitments: Loop through each commitment to see if its next due date is on or before the simulated date.
    const upcoming = commitments.filter((c) => {
      const lastPaid = c.lastExecutionDate || c.startDate;
      let nextDueDate = new Date(lastPaid);

      // Calculate the next due date based on the commitment's frequency.
      switch (c.frequency) {
        case "daily":
          nextDueDate.setUTCDate(nextDueDate.getUTCDate() + 1);
          break;
        case "weekly":
          nextDueDate.setUTCDate(nextDueDate.getUTCDate() + 7);
          break;
        case "monthly":
          nextDueDate.setUTCMonth(nextDueDate.getUTCMonth() + 1);
          break;
        case "quarterly":
          nextDueDate.setUTCMonth(nextDueDate.getUTCMonth() + 3);
          break;
        case "yearly":
          nextDueDate.setUTCFullYear(nextDueDate.getUTCFullYear() + 1);
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

/**
 * @route   POST /api/commitments/:id/execute
 * @desc    Manually execute a commitment, creating a transaction and updating related models.
 * @access  Private
 */
router.post("/:id/execute", auth, async (req, res) => {
  try {
    // 1. Find Commitment: Ensure the commitment exists and belongs to the user.
    const commitment = await Commitment.findById(req.params.id);
    if (!commitment || commitment.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Commitment not found" });
    }

    // 2. Create Transaction: Generate a new transaction record based on the commitment's details.
    const newTransaction = new Transaction({
      user: req.user.id,
      description: commitment.commitmentName,
      amount: commitment.amount,
      type: commitment.commitmentType,
      category: "Recurring Commitment",
      date: new Date(req.body.executionDate),
    });
    await newTransaction.save();

    // 3. Update Linked Items (if any): If the commitment is linked to a goal, loan, or investment, update its progress.
    if (commitment.linkedGoal) {
      await Goal.findByIdAndUpdate(commitment.linkedGoal, {
        $inc: { currentAmount: commitment.amount },
      });
    }
    // Note: The logic for linked loans and investments is not fully implemented in the provided models but is handled here if present.
    if (commitment.linkedLoan) {
      await Loan.findByIdAndUpdate(commitment.linkedLoan, {
        $inc: { amountPaid: commitment.amount },
      });
    }
    if (commitment.linkedInvestment) {
      await Investment.findByIdAndUpdate(commitment.linkedInvestment, {
        $inc: { amountInvested: commitment.amount },
      });
    }

    // 4. Update Commitment: Set the `lastExecutionDate` to prevent it from being processed again for the same period.
    commitment.lastExecutionDate = new Date(req.body.executionDate);
    await commitment.save();

    res.json({ msg: "Commitment executed successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ===================================================================
// == THIS IS THE NEW ROUTE THAT IS MISSING FROM YOUR FILE ==
/**
 * @route   PUT /api/commitments/:id/link-goal
 * @desc    Update an existing commitment to link it to a goal.
 * @access  Private
 */
router.put("/:id/link-goal", auth, async (req, res) => {
  try {
    const { goalId } = req.body;
    const commitment = await Commitment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!commitment) {
      return res.status(404).json({ msg: "Commitment not found" });
    }
    commitment.linkedGoal = goalId;
    await commitment.save();
    res.json(commitment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// ===================================================================

// --- EXPORT ---
module.exports = router;
