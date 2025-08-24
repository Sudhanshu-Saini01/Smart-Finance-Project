// server/models/Commitment.js

// --- IMPORTS ---
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- SCHEMA DEFINITION ---
// This blueprint defines a recurring financial commitment for a user.
// It's used to automate transactions for things like bills, savings plans, or loan payments.
const commitmentSchema = new Schema(
  {
    // --- Core Information ---
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Establishes a direct link to the User model.
      required: true,
    },
    commitmentName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    commitmentType: {
      type: String,
      // 'enum' restricts this field to only accept one of the specified values.
      enum: ["expense", "savings", "investment", "loan", "income"],
      required: true,
    },

    // --- Scheduling ---
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now, // Defaults to the date the commitment was created.
    },
    // Tracks the last time this commitment was processed to prevent duplicate transactions.
    lastExecutionDate: {
      type: Date,
    },

    // --- Optional Linking ---
    // Connects a savings or investment commitment to a specific financial goal.
    linkedGoal: {
      type: Schema.Types.ObjectId,
      ref: "Goal", // Establishes a direct link to the Goal model.
    },
  },
  {
    // --- OPTIONS ---
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// --- MODEL CREATION & EXPORT ---
// Compiles the schema into a 'Commitment' model for interacting with the database.
const Commitment = mongoose.model("Commitment", commitmentSchema);
module.exports = Commitment;
