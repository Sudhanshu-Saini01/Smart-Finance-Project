// // server/controllers/transactionController.js
// const Transaction = require("../models/Transaction");

// // @desc    Get all transactions
// // @route   GET /api/transactions
// // @access  Private
// const getTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find().sort({ date: -1 });
//     res.json(transactions);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// // @desc    Create a new transaction
// // @route   POST /api/transactions
// // @access  Private
// const createTransaction = async (req, res) => {
//   try {
//     const newTransaction = new Transaction(req.body);
//     const transaction = await newTransaction.save();
//     res.status(201).json(transaction);
//   } catch (err) {
//     console.error(err.message);
//     res.status(400).json({ msg: "Failed to create transaction" });
//   }
// };

// // --- NEW UPGRADED FUNCTION ---
// // @desc    Get a detailed monthly summary for the current and previous months
// // @route   GET /api/transactions/monthly-summary
// // @access  Private
// const getMonthlySummary = async (req, res) => {
//   try {
//     const now = new Date();

//     // --- Date ranges for CURRENT month ---
//     const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfCurrentMonth = new Date(
//       now.getFullYear(),
//       now.getMonth() + 1,
//       0
//     );

//     // --- Date ranges for PREVIOUS month ---
//     const startOfPreviousMonth = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       1
//     );
//     const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

//     // Helper function to calculate totals from a list of transactions
//     const calculateTotals = (transactions) => {
//       let totals = {
//         totalIncome: 0,
//         totalExpense: 0,
//         totalSavings: 0,
//         totalInvestments: 0,
//       };
//       transactions.forEach((transaction) => {
//         switch (transaction.type) {
//           case "income":
//             totals.totalIncome += transaction.amount;
//             break;
//           case "expense":
//             totals.totalExpense += transaction.amount;
//             break;
//           case "savings":
//             totals.totalSavings += transaction.amount;
//             break;
//           case "investment":
//             totals.totalInvestments += transaction.amount;
//             break;
//           default:
//             break;
//         }
//       });
//       return totals;
//     };

//     // --- Fetch transactions for both months concurrently ---
//     const [currentMonthTransactions, previousMonthTransactions] =
//       await Promise.all([
//         Transaction.find({
//           date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
//         }),
//         Transaction.find({
//           date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
//         }),
//       ]);

//     // --- Calculate totals for both periods ---
//     const currentMonthSummary = calculateTotals(currentMonthTransactions);
//     const previousMonthSummary = calculateTotals(previousMonthTransactions);

//     // --- Send the final, nested data structure ---
//     res.json({
//       currentMonth: currentMonthSummary,
//       previousMonth: previousMonthSummary,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// };

// module.exports = {
//   getTransactions,
//   createTransaction,
//   // --- Make sure to export the new function ---
//   getMonthlySummary,
// };

// server/controllers/transactionController.js
const Transaction = require("../models/Transaction");

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    // --- THIS IS THE FIX ---
    // We are now filtering transactions to find only those where the 'user' field
    // matches the ID of the user who is currently logged in.
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });
    // --- END OF FIX ---

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    // --- THIS IS A SECURITY UPDATE ---
    // We add the user ID from the authenticated user to the request body.
    // This ensures that a user cannot create a transaction for someone else.
    const newTransaction = new Transaction({
      ...req.body,
      user: req.user.id,
    });
    // --- END OF SECURITY UPDATE ---

    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Failed to create transaction" });
  }
};

// @desc    Get a detailed monthly summary for the current and previous months
// @route   GET /api/transactions/monthly-summary
// @access  Private
const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    );
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const calculateTotals = (transactions) => {
      let totals = {
        totalIncome: 0,
        totalExpense: 0,
        totalSavings: 0,
        totalInvestments: 0,
      };
      transactions.forEach((transaction) => {
        switch (transaction.type) {
          case "income":
            totals.totalIncome += transaction.amount;
            break;
          case "expense":
            totals.totalExpense += transaction.amount;
            break;
          case "savings":
            totals.totalSavings += transaction.amount;
            break;
          case "investment":
            totals.totalInvestments += transaction.amount;
            break;
          default:
            break;
        }
      });
      return totals;
    };

    // --- THIS IS A FIX ---
    // The database query must also be filtered by the logged-in user ID.
    const [currentMonthTransactions, previousMonthTransactions] =
      await Promise.all([
        Transaction.find({
          user: req.user.id, // Filter for current user
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        }),
        Transaction.find({
          user: req.user.id, // Filter for current user
          date: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
        }),
      ]);
    // --- END OF FIX ---

    const currentMonthSummary = calculateTotals(currentMonthTransactions);
    const previousMonthSummary = calculateTotals(previousMonthTransactions);

    res.json({
      currentMonth: currentMonthSummary,
      previousMonth: previousMonthSummary,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  getMonthlySummary,
};
