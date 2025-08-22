// server/routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
//-------- Start: Version V3.0.0---------//
const Commitment = require("../models/Commitment");
const Goal = require("../models/Goal");
const Loan = require("../models/Loan");
const Investment = require("../models/Investment");
//-------- End: Version V3.0.0---------//

// The POST route is now much simpler. It no longer handles any automation.
router.post("/", auth, async (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body;
    const newTransaction = new Transaction({
      user: req.user.id,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date ? new Date(date) : new Date(),
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @route   POST /api/transactions
// // @desc    Add a new transaction and trigger automation on first income
// // @access  Private
// router.post("/", auth, async (req, res) => {
//   try {
//     const { description, amount, type, category, date } = req.body;
//     const transactionAmount = parseFloat(amount);

//     const newTransaction = new Transaction({
//       user: req.user.id,
//       description,
//       amount: transactionAmount,
//       type,
//       category,
//       date: date ? new Date(date) : new Date(),
//     });
//     await newTransaction.save();

//     //-------- Start: Version V3.0.0---------//
//     // AUTOMATION LOGIC: Trigger on first income of the month
//     if (type === "income") {
//       const now = new Date(newTransaction.date);
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

//       // Check if another income transaction already exists this month
//       const existingIncome = await Transaction.findOne({
//         user: req.user.id,
//         type: "income",
//         date: { $gte: startOfMonth },
//         _id: { $ne: newTransaction._id }, // Exclude the one we just created
//       });

//       // If no other income exists this month, run the commitments
//       if (!existingIncome) {
//         console.log(
//           "First income of the month detected. Running commitments..."
//         );
//         const commitments = await Commitment.find({ user: req.user.id });

//         for (const commitment of commitments) {
//           // 1. Create a transaction for the commitment
//           const commitmentTx = new Transaction({
//             user: req.user.id,
//             description: commitment.commitmentName,
//             amount: commitment.amount,
//             type: commitment.commitmentType,
//             category: "Recurring Commitment",
//             date: new Date(
//               now.getFullYear(),
//               now.getMonth(),
//               commitment.paymentDay
//             ),
//           });
//           await commitmentTx.save();

//           // 2. Update linked goals, loans, or investments
//           if (commitment.linkedGoal) {
//             await Goal.findByIdAndUpdate(commitment.linkedGoal, {
//               $inc: { currentAmount: commitment.amount },
//             });
//           }
//           if (commitment.linkedLoan) {
//             await Loan.findByIdAndUpdate(commitment.linkedLoan, {
//               $inc: { amountPaid: commitment.amount },
//             });
//           }
//           if (commitment.linkedInvestment) {
//             await Investment.findByIdAndUpdate(commitment.linkedInvestment, {
//               $inc: { amountInvested: commitment.amount },
//             });
//           }
//         }
//       }
//     }
//     //-------- End: Version V3.0.0---------//

//     res.status(201).json(newTransaction);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// --- DYNAMIC MONTHLY SUMMARY ROUTE ---
// ... (This part of the file remains the same) ...
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
      let totalFixedExpense = 0;

      for (const t of transactions) {
        if (t.type === "income") {
          totalIncome += t.amount;
        } else if (t.type === "expense") {
          totalExpense += t.amount;
          if (t.occurrence === "monthly" || t.occurrence === "weekly") {
            totalFixedExpense += t.amount;
          }
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
        totalFixedExpense,
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
// ... (This part of the file remains the same) ...
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
