// server/models/Goal.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goalName: {
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    goalType: {
      type: String,
      enum: ["item", "event"],
      required: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "https://placehold.co/600x400/6c757d/FFF?text=My+Goal",
    },

    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    // --- Payment Strategy ---
    paymentType: {
      type: String,
      enum: ["manual", "automatic"],
      default: "manual",
    },
    paymentFrequency: {
      type: String,
      enum: ["monthly", "occasionally"],
      default: "occasionally",
    },
    // --- Funding Details ---
    fundingSources: {
      fromSavings: { type: Number, default: 0 },
      fromInvestments: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);

module.exports = Goal;
