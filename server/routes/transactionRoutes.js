// server/routes/transactionRoutes.js
import express from 'express';
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// This route handles getting all transactions and creating a new one.
// Both actions are protected.
router.route('/')
  .get(protect, getTransactions)
  .post(protect, createTransaction);

// This route handles updating and deleting a SINGLE transaction by its ID.
// Both actions are protected.
router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

export default router;