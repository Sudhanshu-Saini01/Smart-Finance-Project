// server/controllers/commitmentController.js
const Commitment = require("../models/Commitment");

// @desc    Get all commitments
// @route   GET /api/commitments
// @access  Private
const getCommitments = async (req, res) => {
  try {
    const commitments = await Commitment.find().sort({ nextDueDate: 1 });
    res.json(commitments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @desc    Create a new commitment
// @route   POST /api/commitments
// @access  Private
const createCommitment = async (req, res) => {
  try {
    const newCommitment = new Commitment(req.body);
    const commitment = await newCommitment.save();
    res.status(201).json(commitment);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Failed to create commitment" });
  }
};

module.exports = {
  getCommitments,
  createCommitment,
};
