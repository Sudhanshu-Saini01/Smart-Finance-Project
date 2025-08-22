// server/models/Commitment.js
//-------- Start: Version V3.0.0---------//

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commitmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commitmentName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // This tells the app what KIND of commitment it is.
    commitmentType: {
      type: String,
      enum: ["expense", "savings", "investment", "loan"],
      required: true,
    },
    // Replaced paymentDay with a more flexible system
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "one-time"],
      default: "one-time",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    // This is crucial for tracking when the commitment was last paid.
    lastExecutionDate: {
      type: Date,
    },

    // This links a savings/investment commitment directly to a goal.
    linkedGoal: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
    },
    // This links the commitment to a specific loan document.
    linkedLoan: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
    },
    // This links the commitment to a specific investment document.
    linkedInvestment: {
      type: Schema.Types.ObjectId,
      ref: "Investment",
    },
  },
  {
    timestamps: true,
  }
);

const Commitment = mongoose.model("Commitment", commitmentSchema);

module.exports = Commitment;
//-------- End: Version V3.0.0---------//
