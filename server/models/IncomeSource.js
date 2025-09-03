// server/models/IncomeSource.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const incomeSourceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceName: {
      type: String,
      required: true,
      trim: true,
    },
    incomeType: {
      type: String,
      required: true,
      enum: ["Salary", "Freelance", "Investment", "Other"],
      default: "Salary",
    },
    grossAmount: {
      type: Number,
      required: true,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["weekly", "bi-weekly", "monthly", "annually"],
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

const IncomeSource = mongoose.model("IncomeSource", incomeSourceSchema);

// Use the modern 'export default' syntax
export default IncomeSource;
