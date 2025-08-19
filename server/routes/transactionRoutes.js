// server/routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

// --- (NEW) DYNAMIC MONTHLY SUMMARY ROUTE ---
// This replaces the old /summary route.
// @route   GET /api/transactions/monthly-summary
// @desc    Get detailed financial summaries for the current and previous months
// @access  Private
router.get("/monthly-summary", auth, async (req, res) => {
  try {
    const now = new Date();
    // Define date ranges
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

    // Helper function to process transactions for a given period
    const processTransactions = (transactions) => {
      let totalIncome = 0;
      let totalExpense = 0;
      let totalSavings = 0;
      let totalInvestments = 0;
      let lastIncomeDate = null;
      let lastExpenseDate = null;

      // Define categories that count towards savings/investments
      const savingsCategories = ["savings", "emergency fund"];
      const investmentCategories = [
        "investment",
        "stocks",
        "sip",
        "mutual fund",
      ];

      for (const t of transactions) {
        if (t.type === "income") {
          totalIncome += t.amount;
          if (!lastIncomeDate || t.date > lastIncomeDate) {
            lastIncomeDate = t.date;
          }
        } else if (t.type === "expense") {
          const categoryLower = t.category.toLowerCase();
          if (savingsCategories.includes(categoryLower)) {
            totalSavings += t.amount;
          } else if (investmentCategories.includes(categoryLower)) {
            totalInvestments += t.amount;
          } else {
            totalExpense += t.amount;
          }
          if (!lastExpenseDate || t.date > lastExpenseDate) {
            lastExpenseDate = t.date;
          }
        }
      }
      return {
        totalIncome,
        totalExpense,
        totalSavings,
        totalInvestments,
        lastIncomeDate,
        lastExpenseDate,
      };
    };

    // Fetch transactions for both months
    const currentMonthTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });
    const previousMonthTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });

    // Process both sets of transactions
    const currentMonthData = processTransactions(currentMonthTxs);
    const previousMonthData = processTransactions(previousMonthTxs);

    res.json({
      currentMonth: {
        month: startOfCurrentMonth.toLocaleString("default", { month: "long" }),
        year: startOfCurrentMonth.getFullYear(),
        ...currentMonthData,
      },
      previousMonth: {
        month: startOfPreviousMonth.toLocaleString("default", {
          month: "long",
        }),
        year: startOfPreviousMonth.getFullYear(),
        ...previousMonthData,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- ROUTE TO ADD A NEW TRANSACTION ---
// We need to update this to accept the new fields
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category, occurrence, date } = req.body;
    const newTransaction = new Transaction({
      user: req.user.id,
      description,
      amount,
      type,
      category,
      occurrence,
      date: date ? new Date(date) : new Date(), // Allow user to specify a date
    });
    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- ROUTE TO GET ALL OF A USER'S TRANSACTIONS ---
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
