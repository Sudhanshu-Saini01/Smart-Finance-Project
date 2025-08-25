// server/controllers/incomeSourceController.js
const IncomeSource = require("../models/IncomeSource");

// @desc    Get all income sources
// @route   GET /api/income
// @access  Private
const getIncomeSources = async (req, res) => {
  try {
    const sources = await IncomeSource.find().sort({ nextDueDate: 1 });
    res.json(sources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new income source
// @route   POST /api/income
// @access  Private
const createIncomeSource = async (req, res) => {
  try {
    const {
      sourceName,
      incomeType,
      grossAmount,
      deductions = [],
      frequency,
      nextDueDate,
    } = req.body;

    const totalDeductions = deductions.reduce(
      (acc, curr) => acc + curr.amount,
      0
    );
    const netAmount = grossAmount - totalDeductions;

    const newSource = new IncomeSource({
      sourceName,
      incomeType,
      grossAmount,
      deductions,
      netAmount,
      frequency,
      nextDueDate,
    });

    const source = await newSource.save();
    res.status(201).json(source);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Failed to create income source" });
  }
};

module.exports = {
  getIncomeSources,
  createIncomeSource,
};
