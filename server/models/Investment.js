// server/models/Investment.js
// /----- VERSION V2 -----/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const investmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    investmentName: {
      type: String,
      required: true,
      trim: true,
    },
    investmentType: {
      type: String,
      enum: [
        "Mutual Fund",
        "Stock",
        "Fixed Deposit",
        "Recurring Deposit",
        "PPF",
        "Other",
      ],
      required: true,
    },
    amountInvested: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expectedRoi: {
      // Expected Return on Investment
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;
// /----- END VERSION V2 -----/
