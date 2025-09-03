// server/models/Loan.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const loanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    assetType: {
      type: String,
      enum: ["appreciating", "depreciating", "neutral"],
      default: "neutral",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    emi: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
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
    timestamps: true,
  }
);

const Loan = mongoose.model("Loan", loanSchema);

// Use the modern 'export default' syntax
export default Loan;
