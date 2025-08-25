// server/models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    savingsGoal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// IMPORTANT: This method attaches the password-checking function to each user document.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt to compare the plain text password from the login form
  // with the hashed password stored in the database.
  return await bcrypt.compare(enteredPassword, this.password);
};

// This middleware runs BEFORE a user document is saved.
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }

  // Generate a salt and hash the password.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
