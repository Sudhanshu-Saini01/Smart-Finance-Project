// server/routes/transactionRoutes.js

// --- IMPORTS ---
const express = require("express");
const auth = require("../middleware/authMiddleware"); // Middleware to protect routes.
const Transaction = require("../models/Transaction"); // The data model for transactions.

// Note: Unused models (User, Commitment, Goal, etc.) have been removed to keep the file clean.

const router = express.Router();

// --- ROUTES ---

/**
 * @route   POST /api/transactions
 * @desc    Add a new transaction for the logged-in user.
 * @access  Private
 */
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;

    // 1. Create New Transaction: Build a new transaction object using the provided data.
    const newTransaction = new Transaction({
      user: req.user.id, // Link the transaction to the authenticated user.
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date ? new Date(date) : new Date(), // Use provided date or default to now.
    });

    // 2. Save to Database: Persist the new transaction record.
    await newTransaction.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/transactions/monthly-summary
 * @desc    Get a financial summary for the current and previous months.
 * @access  Private
 */
router.get("/monthly-summary", auth, async (req, res) => {
  try {
    // 1. Define Date Ranges: Calculate the start and end dates for the current and previous months.
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    );

    // 2. Helper Function: A reusable function to process a list of transactions and return totals.
    const processTransactions = (transactions) => {
      let totals = {
        totalIncome: 0,
        totalExpense: 0,
        totalSavings: 0,
        totalInvestments: 0,
      };

      for (const t of transactions) {
        if (t.type === "income") totals.totalIncome += t.amount;
        else if (t.type === "expense") totals.totalExpense += t.amount;
        else if (t.type === "savings") totals.totalSavings += t.amount;
        else if (t.type === "investment") totals.totalInvestments += t.amount;
      }
      return totals;
    };

    // 3. Fetch Data: Retrieve all transactions for the current and previous months from the database.
    const currentMonthTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });
    const previousMonthTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });

    // 4. Send Response: Process both sets of transactions and send the structured summary back to the client.
    res.json({
      currentMonth: {
        month: startOfCurrentMonth.toLocaleString("default", { month: "long" }),
        year: startOfCurrentMonth.getFullYear(),
        ...processTransactions(currentMonthTxs),
      },
      previousMonth: {
        month: startOfPreviousMonth.toLocaleString("default", {
          month: "long",
        }),
        year: startOfPreviousMonth.getFullYear(),
        ...processTransactions(previousMonthTxs),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions for the logged-in user, sorted by most recent.
 * @access  Private
 */
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1, // Sorts in descending order (newest first).
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- EXPORT ---
// Makes the router available for use in the main server file (index.js).
module.exports = router;
