// server/models/User.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
