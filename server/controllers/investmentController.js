// server/controllers/investmentController.js
const Investment = require("../models/Investment");

// @desc    Get all investments
// @route   GET /api/investments
// @access  Private
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find().sort({ startDate: -1 });
    res.json(investments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new investment
// @route   POST /api/investments
// @access  Private
const createInvestment = async (req, res) => {
  try {
    const newInvestment = new Investment(req.body);
    const investment = await newInvestment.save();
    res.status(201).json(investment);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Failed to create investment" });
  }
};

module.exports = {
  getInvestments,
  createInvestment,
};
