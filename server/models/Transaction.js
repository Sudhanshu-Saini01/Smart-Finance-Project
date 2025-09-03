// server/models/Transaction.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      enum: ["income", "expense", "savings", "investment"],
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

// Use the modern 'export default' syntax
export default Transaction;
