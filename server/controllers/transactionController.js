// server/controllers/transactionController.js
import Transaction from '../models/Transaction.js';

/**
 * @desc    Get all transactions for the logged-in user
 */
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Create a new transaction for the logged-in user
 */
const createTransaction = async (req, res, next) => {
  try {
    const newTransaction = new Transaction({ ...req.body, user: req.user.id });
    const transaction = await newTransaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Update a transaction for the logged-in user
 */
const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTransaction);
    } catch (err) {
        next(err);
    }
};

/**
 * @desc    Delete a transaction for the logged-in user
 */
const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction || transaction.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.deleteOne();
        res.json({ message: 'Transaction removed' });
    } catch (err) {
        next(err);
    }
};


export { 
  getTransactions, 
  createTransaction,
  updateTransaction,
  deleteTransaction
};