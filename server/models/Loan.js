// server/models/Loan.js

// --- IMPORTS ---
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- SCHEMA DEFINITION ---
// This blueprint defines the structure for a user's loan record.
// It's used to track debts, repayment progress, and key loan details.
const loanSchema = new Schema(
  {
    // --- Core Information ---
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Establishes a direct link to the User model.
      required: true,
    },
    loanName: {
      type: String,
      required: true,
      trim: true,
    },
    lender: {
      type: String,
      required: true,
      trim: true,
    },
    loanType: {
      type: String,
      enum: ["personal", "home", "vehicle", "education", "other"],
      default: "other",
    },
    // Used for financial advisory logic to categorize the loan's purpose.
    assetType: {
      type: String,
      enum: ["appreciating", "depreciating", "neutral"],
      default: "neutral",
    },

    // --- Financial Details ---
    totalAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    // Equated Monthly Installment (EMI).
    emi: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },

    // --- Timeline & Status ---
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paid"],
      default: "active",
    },
  },
  {
    // --- OPTIONS ---
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// --- MODEL CREATION & EXPORT ---
// Compiles the schema into a 'Loan' model for interacting with the database.
const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
