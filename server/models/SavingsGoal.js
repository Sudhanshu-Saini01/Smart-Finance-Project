// server/models/SavingsGoal.js (NEW FILE)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savingsGoalSchema = new Schema(
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
      required: true,
      default: 0,
    },
    // This is the crucial link to the wishlist
    wishlistItem: {
      type: Schema.Types.ObjectId,
      ref: "WishlistItem",
      required: false, // A goal doesn't *have* to be for a wishlist item
    },
  },
  {
    timestamps: true,
  }
);

const SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);

module.exports = SavingsGoal;
