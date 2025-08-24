// server/models/Transaction.js

// --- IMPORTS ---
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- SCHEMA DEFINITION ---
// This blueprint defines the structure for a single financial transaction.
// It's the fundamental record for all income, expenses, savings, and investments.
const transactionSchema = new Schema(
  {
    // --- Core Information ---
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Establishes a direct link to the User model.
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      // 'enum' restricts this field to one of the four fundamental transaction types.
      enum: ["income", "expense", "savings", "investment"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Other", // Provides a fallback category if none is specified.
    },
    date: {
      type: Date,
      default: Date.now, // Defaults to the date the transaction was recorded.
    },
  },
  {
    // --- OPTIONS ---
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// --- MODEL CREATION & EXPORT ---
// Compiles the schema into a 'Transaction' model for interacting with the database.
const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
