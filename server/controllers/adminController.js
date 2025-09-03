// server/controllers/adminController.js

import User from "../models/User.js";
import IncomeSource from "../models/IncomeSource.js";
import Transaction from "../models/Transaction.js";

/**
 * @desc    Admin action to simulate a deposit for a specific user.
 * @route   POST /api/admin/simulate-deposit
 * @access  Admin
 */
export const simulateDeposit = async (req, res, next) => {
  const { userId, sourceName, amount } = req.body;

  if (!userId || !sourceName || !amount) {
    return res
      .status(400)
      .json({ message: "Please provide userId, sourceName, and amount" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // 1. Create the new Income Source for the target user
    const newIncomeSource = await IncomeSource.create({
      user: userId,
      sourceName: sourceName,
      incomeType: "Salary", // Defaulting to Salary for this simulation
      grossAmount: amount,
      netAmount: amount, // Assuming gross and net are the same for simplicity
      frequency: "monthly",
    });

    // 2. Create a corresponding "income" transaction for the target user
    await Transaction.create({
      user: userId,
      description: sourceName,
      category: "Salary",
      type: "income",
      amount: amount,
    });

    res.status(201).json({
      message: `Successfully created income source and transaction for ${user.name}`,
      data: newIncomeSource,
    });
  } catch (error) {
    next(error);
  }
};

// --- NEW: Function for admins to get a list of all users ---
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("name email"); // Get all users, only name and email
    res.json(users);
  } catch (error) {
    next(error);
  }
};
