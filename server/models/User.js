// server/models/User.js

// --- 1. IMPORT MONGOOSE ---
// We need mongoose to define our schema and model
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- 2. DEFINE THE USER SCHEMA ---
// This is the blueprint for our user data.
// It specifies the fields, their types, and any rules (like being required or unique).
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // NEW FIELD: To store user's financial allocation strategy
    allocations: {
      expense: { type: Number, default: 70 },
      savings: { type: Number, default: 20 },
      investment: { type: Number, default: 10 },
    },
    // /----- VERSION V2 -----/
    // These fields will act as the user's main pools of available funds.
    unallocatedSavings: {
      type: Number,
      default: 0,
    },
    unallocatedInvestments: {
      type: Number,
      default: 0,
    },
    // /----- END VERSION V2 -----/
  },
  {
    // --- 3. ADD TIMESTAMPS ---
    // This option automatically adds two fields to our documents:
    // `createdAt` and `updatedAt`. It's great for tracking when data is created or modified.
    timestamps: true,
  }
);

// --- 4. CREATE AND EXPORT THE MODEL ---
// We compile our schema into a model. A model is like a class or a template
// that we can use to create, read, update, and delete user documents in our database.
// The first argument 'User' is the singular name of the collection your model is for.
// Mongoose automatically looks for the plural, lowercased version of your model name.
// So, the 'User' model will be for the 'users' collection in the database.
const User = mongoose.model("User", userSchema);

// We export the User model so we can use it in other files in our project (like index.js)
module.exports = User;
