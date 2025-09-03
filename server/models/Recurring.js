// server/models/Recurring.js
import mongoose from "mongoose";
const { Schema } = mongoose;

// Renamed from commitmentSchema to recurringSchema
const recurringSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true }, // Renamed from commitmentName
    amount: { type: Number, required: true },
    type: {
      // Renamed from commitmentType
      type: String,
      enum: ["expense", "savings", "investment"],
      required: true,
    },
    frequency: { type: String, enum: ["monthly", "yearly"], required: true },
    nextDueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Recurring = mongoose.model("Recurring", recurringSchema);

export default Recurring;
