// server/models/Investment.js

// --- IMPORTS ---
import mongoose from "mongoose";
const Schema = mongoose.Schema;

// --- SCHEMA DEFINITION ---
// This blueprint defines the structure for a user's investment record.
// It's used to track different types of investments and their performance.
const investmentSchema = new Schema(
  {
    // --- Core Information ---
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Establishes a direct link to the User model.
      required: true,
    },
    investmentName: {
      type: String,
      required: true,
      trim: true,
    },
    investmentType: {
      type: String,
      // 'enum' restricts this field to a predefined list of investment types.
      enum: [
        "Mutual Fund",
        "Stock",
        "Fixed Deposit",
        "Recurring Deposit",
        "PPF",
        "Other",
      ],
      required: true,
    },
    amountInvested: {
      type: Number,
      required: true,
    },

    // --- Tracking Details ---
    startDate: {
      type: Date,
      default: Date.now, // Defaults to the date the investment was recorded.
    },
    // The user's expected Return on Investment (ROI) as a percentage.
    expectedRoi: {
      type: Number,
      default: 0,
    },
  },
  {
    // --- OPTIONS ---
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// --- MODEL CREATION & EXPORT ---
// Compiles the schema into an 'Investment' model for interacting with the database.
const Investment = mongoose.model("Investment", investmentSchema);
export default Investment;
