// server/routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// /----- VERSION V2 -----/
// @route   POST /api/transactions
// @desc    Add a new transaction and handle income/savings/investment allocation
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;
    const user = await User.findById(req.user.id);
    const transactionAmount = parseFloat(amount);

    const newTransaction = new Transaction({
      user: user._id,
      description,
      amount: transactionAmount,
      type,
      category,
      date,
    });
    await newTransaction.save();

    // Handle allocation to money pools
    if (type === "income") {
      const { allocations } = user;
      const savingsAmount = transactionAmount * (allocations.savings / 100);
      const investmentAmount =
        transactionAmount * (allocations.investment / 100);

      user.unallocatedSavings += savingsAmount;
      user.unallocatedInvestments += investmentAmount;
    } else if (type === "savings") {
      user.unallocatedSavings += transactionAmount;
    } else if (type === "investment") {
      user.unallocatedInvestments += transactionAmount;
    }
    await user.save();

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// /----- END VERSION V2 -----/

// --- DYNAMIC MONTHLY SUMMARY ROUTE ---
// This route now correctly calculates savings/investments based on transactions within the month
router.get("/monthly-summary", auth, async (req, res) => {
  try {
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

    const processTransactions = (transactions) => {
      let totalIncome = 0,
        totalExpense = 0,
        totalSavings = 0,
        totalInvestments = 0;
      let lastIncomeDate = null,
        lastExpenseDate = null;

      for (const t of transactions) {
        if (t.type === "income") {
          totalIncome += t.amount;
          if (!lastIncomeDate || t.date > lastIncomeDate)
            lastIncomeDate = t.date;
        } else if (t.type === "expense") {
          totalExpense += t.amount;
          if (!lastExpenseDate || t.date > lastExpenseDate)
            lastExpenseDate = t.date;
        } else if (t.type === "savings") {
          totalSavings += t.amount;
        } else if (t.type === "investment") {
          totalInvestments += t.amount;
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

    const currentMonthTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });
    const previousMonthTxs = await Transaction.find({
      user: req.user.id,
      date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });

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
