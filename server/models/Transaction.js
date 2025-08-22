// server/models/Transaction.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    // /----- VERSION V2 -----/
    // The 'type' field is now more comprehensive.
    type: {
      type: String,
      required: true,
      enum: ["income", "expense", "savings", "investment"],
    },
    // /----- END VERSION V2 -----/
    category: {
      type: String,
      required: true,
      trim: true,
      default: "Other",
    },
    // occurrence: {
    //   type: String,
    //   enum: ["one-time", "monthly", "weekly"],
    //   default: "one-time",
    // },
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

module.exports = Transaction;
