// server/models/IncomeSource.js

const mongoose = require("mongoose");

// A sub-schema for individual deductions (like tax, PF, etc.)
const deductionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // _id: false means deductions don't get their own IDs.

const incomeSourceSchema = new mongoose.Schema(
  {
    sourceName: {
      type: String,
      required: true,
      trim: true,
    },
    incomeType: {
      type: String,
      required: true,
      enum: ["Active", "Passive", "Portfolio"], // Only allows these values
    },
    grossAmount: {
      // The full amount before deductions
      type: Number,
      required: true,
    },
    deductions: [deductionSchema], // An array of deductions
    netAmount: {
      // The final take-home amount
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
      enum: [
        "Monthly",
        "Weekly",
        "Bi-Weekly",
        "Quarterly",
        "Annually",
        "One-Time",
      ],
    },
    nextDueDate: {
      type: Date,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

const IncomeSource = mongoose.model("IncomeSource", incomeSourceSchema);

module.exports = IncomeSource;
