// server/routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User"); // We need the User model to get allocations

// /----- VERSION V2 -----/
// @route   POST /api/transactions
// @desc    Add a new transaction and handle income/savings/investment allocation
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;
    const user = await User.findById(req.user.id);
    const transactionAmount = parseFloat(amount);

    // 1. Save the primary transaction
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

      // /----- Removed from VERSION V2 -----/
      // Define categories that count towards savings/investments
      // const savingsCategories = ["savings", "emergency fund"];
      // const investmentCategories = [
      //   "investment",
      //   "stocks",
      //   "sip",
      //   "mutual fund",
      // ];

      // /----- VERSION V2 -----/
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
      // /----- END VERSION V2 -----/

      // /----- Replaced with above in VERSION V2 -----/
      // for (const t of transactions) {
      //   if (t.type === "income") {
      //     totalIncome += t.amount;
      //     if (!lastIncomeDate || t.date > lastIncomeDate) {
      //       lastIncomeDate = t.date;
      //     }
      //   } else if (t.type === "expense") {
      //     const categoryLower = t.category.toLowerCase();
      //     if (savingsCategories.includes(categoryLower)) {
      //       totalSavings += t.amount;
      //     } else if (investmentCategories.includes(categoryLower)) {
      //       totalInvestments += t.amount;
      //     } else {
      //       totalExpense += t.amount;
      //     }
      //     if (!lastExpenseDate || t.date > lastExpenseDate) {
      //       lastExpenseDate = t.date;
      //     }
      //   }
      // }
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

// // --- ROUTE TO ADD A NEW TRANSACTION ---
// // We need to update this to accept the new fields
// router.post("/", auth, async (req, res) => {
//   try {
//     const { description, amount, type, category, occurrence, date } = req.body;
//     const newTransaction = new Transaction({
//       user: req.user.id,
//       description,
//       amount,
//       type,
//       category,
//       occurrence,
//       date: date ? new Date(date) : new Date(), // Allow user to specify a date
//     });
//     const transaction = await newTransaction.save();
//     res.status(201).json(transaction);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

//-----REMOVED FORM VERSION 2 BUT I DON'T COMMIT OR REMOVE IT FROM HERE-----//
// --- (UPGRADED) ROUTE TO ADD A NEW TRANSACTION WITH AUTO-ALLOCATION ---
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category, occurrence, date } = req.body;
    const transactionAmount = parseFloat(amount);

    // 1. Save the primary transaction (e.g., the income)
    const primaryTransaction = new Transaction({
      user: req.user.id,
      description,
      amount: transactionAmount,
      type,
      category,
      occurrence,
      date: date ? new Date(date) : new Date(),
    });
    await primaryTransaction.save();

    const createdTransactions = [primaryTransaction];

    // 2. If it's an income transaction, trigger auto-allocation
    if (type === "income") {
      const user = await User.findById(req.user.id);
      const { allocations } = user;

      // Calculate amounts based on user's percentages
      const savingsAmount = transactionAmount * (allocations.savings / 100);
      const investmentAmount =
        transactionAmount * (allocations.investment / 100);

      // 3. Create the automatic "Savings" transaction
      if (savingsAmount > 0) {
        const savingsTransaction = new Transaction({
          user: req.user.id,
          description: `Auto-allocated Savings from ${description}`,
          amount: savingsAmount,
          type: "expense", // Savings are treated as an expense from the main balance
          category: "Savings",
          occurrence: "one-time",
          date: primaryTransaction.date,
        });
        await savingsTransaction.save();
        createdTransactions.push(savingsTransaction);
      }

      // 4. Create the automatic "Investment" transaction
      if (investmentAmount > 0) {
        const investmentTransaction = new Transaction({
          user: req.user.id,
          description: `Auto-allocated Investment from ${description}`,
          amount: investmentAmount,
          type: "expense", // Investments are also an expense from the main balance
          category: "Investment",
          occurrence: "one-time",
          date: primaryTransaction.date,
        });
        await investmentTransaction.save();
        createdTransactions.push(investmentTransaction);
      }
    }

    res.status(201).json(createdTransactions);
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
