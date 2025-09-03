// server/models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 4,
      select: false,
    },
    // --- NEW: User Role for Authorization ---
    role: {
      type: String,
      enum: ["user", "admin"], // Only allows these two values
      default: "user", // New signups are always 'user' by default
    },
    // Note: monthlyIncome and savingsGoal might be better calculated fields
    // rather than stored directly on the User model. We can refactor this later.
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

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
