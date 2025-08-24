// server/models/User.js

// --- IMPORTS ---
// Mongoose is our tool for creating data schemas, which are like blueprints for our database documents.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- SCHEMA DEFINITION ---
// This blueprint defines the structure and rules for every user document in our database.
const userSchema = new Schema(
  {
    // --- Basic Information ---
    name: {
      type: String,
      required: true, // A name is mandatory.
      trim: true, // Removes any extra spaces from the beginning or end.
    },
    email: {
      type: String,
      required: true, // An email is mandatory.
      unique: true, // Each email must be unique in the database.
      trim: true,
      lowercase: true, // Converts the email to lowercase to ensure consistency.
    },
    password: {
      type: String,
      required: true, // A password is mandatory.
    },

    // --- Financial Settings ---
    // Default allocation percentages for incoming funds.
    allocations: {
      expense: { type: Number, default: 70 }, // 70% to daily expenses.
      savings: { type: Number, default: 20 }, // 20% to savings.
      investment: { type: Number, default: 10 }, // 10% to investments.
    },

    // --- Fund Pools ---
    // These fields track the user's available funds that have been allocated but not yet spent or assigned to a specific goal.
    unallocatedSavings: {
      type: Number,
      default: 0,
    },
    unallocatedInvestments: {
      type: Number,
      default: 0,
    },
  },
  {
    // --- OPTIONS ---
    // Automatically adds `createdAt` and `updatedAt` fields to each document,
    // which is useful for tracking when data is created or modified.
    timestamps: true,
  }
);

// --- MODEL CREATION & EXPORT ---
// Compiles our schema blueprint into a usable 'User' model and exports it.
// This model is what we'll use to find, create, update, and delete users in our database.
const User = mongoose.model("User", userSchema);
module.exports = User;
