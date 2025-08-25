// server/controllers/transactionController.js
const Transaction = require("../models/Transaction");

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
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
    const newTransaction = new Transaction(req.body);
    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Failed to create transaction" });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
};
