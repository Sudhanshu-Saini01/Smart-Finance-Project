// server/models/Insurance.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const insuranceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    policyName: {
      type: String,
      required: true,
      trim: true,
    },
    policyType: {
      type: String,
      enum: ["Health", "Life", "Auto", "Home", "Other"],
      required: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    policyNumber: {
      type: String,
      trim: true,
    },
    coverageAmount: {
      type: Number,
      required: true,
    },
    premiumAmount: {
      type: Number,
      required: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);

export default Insurance;
