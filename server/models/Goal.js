// server/models/Goal.js

// --- IMPORTS ---
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- SCHEMA DEFINITION ---
// This blueprint defines the structure for a user's financial goal.
// It tracks their progress towards a specific target, like saving for an item or event.
const goalSchema = new Schema(
  {
    // --- Core Information ---
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Establishes a direct link to the User model.
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
      default: 0, // Starts at 0 and increases as the user saves.
    },
    goalType: {
      type: String,
      enum: ["item", "event"], // The goal is for either a physical item or an event.
      required: true,
    },

    // --- Optional Details ---
    imageUrl: {
      type: String,
      trim: true,
      // Provides a default placeholder image if the user doesn't upload one.
      default: "https://placehold.co/600x400/6c757d/FFF?text=My+Goal",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },

    // --- Linking ---
    // Connects this goal to a specific recurring commitment for automatic savings.
    linkedCommitment: {
      type: Schema.Types.ObjectId,
      ref: "Commitment", // Establishes a direct link to the Commitment model.
    },
  },
  {
    // --- OPTIONS ---
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

// --- MODEL CREATION & EXPORT ---
// Compiles the schema into a 'Goal' model for interacting with the database.
const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;
