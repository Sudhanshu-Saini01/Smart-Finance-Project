//2 // server/models/IncomeSource.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSourceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
      trim: true,
    },
    // Type of income (e.g., salary, freelance, investment)
    incomeType: {
      type: String,
      required: true,
      enum: ['Salary', 'Freelance', 'Investment', 'Other'],
      default: 'Salary'
    },
    // The total amount before deductions
    grossAmount: {
      type: Number,
      required: true,
    },
    // The amount received after taxes and other deductions
    netAmount: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      // Corrected enum to include more standard options
      enum: ['weekly', 'bi-weekly', 'monthly', 'annually'],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const IncomeSource = mongoose.model('IncomeSource', incomeSourceSchema);

module.exports = IncomeSource;



//1 // server/models/IncomeSource.js

// const mongoose = require("mongoose");

// // A sub-schema for individual deductions (like tax, PF, etc.)
// const deductionSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//   },
//   { _id: false }
// ); // _id: false means deductions don't get their own IDs.

// const incomeSourceSchema = new mongoose.Schema(
//   {
//     sourceName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     incomeType: {
//       type: String,
//       required: true,
//       enum: ["Active", "Passive", "Portfolio"], // Only allows these values
//     },
//     grossAmount: {
//       // The full amount before deductions
//       type: Number,
//       required: true,
//     },
//     deductions: [deductionSchema], // An array of deductions
//     netAmount: {
//       // The final take-home amount
//       type: Number,
//       required: true,
//     },
//     frequency: {
//       type: String,
//       required: true,
//       enum: [
//         "Monthly",
//         "Weekly",
//         "Bi-Weekly",
//         "Quarterly",
//         "Annually",
//         "One-Time",
//       ],
//     },
//     nextDueDate: {
//       type: Date,
//     },
//   },
//   { timestamps: true }
// ); // Automatically adds createdAt and updatedAt

// const IncomeSource = mongoose.model("IncomeSource", incomeSourceSchema);

// module.exports = IncomeSource;
