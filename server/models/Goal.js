// server/models/Goal.js

import mongoose from "mongoose";
const { Schema } = mongoose;

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
    linkedRecurring: {
      type: Schema.Types.ObjectId,
      ref: "Recurring",
    },
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);

// Use the modern 'export default' syntax
export default Goal;
