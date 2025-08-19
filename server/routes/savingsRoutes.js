// server/routes/savingsRoutes.js (UPDATE THIS FILE)

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const SavingsGoal = require("../models/SavingsGoal");
const WishlistItem = require("../models/WishlistItem"); // We need this model to update it

// @route   POST /api/savings
// @desc    Create a new savings goal
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { goalName, targetAmount, wishlistItem } = req.body;
    const newGoal = new SavingsGoal({
      user: req.user.id,
      goalName,
      targetAmount,
      wishlistItem,
    });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/savings
// @desc    Get all of a user's savings goals
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id })
      .populate("wishlistItem", ["itemName", "itemPrice"])
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/savings/:id
// @desc    Update a savings goal (e.g., add money to it)
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const { amountToAdd } = req.body;
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: "Goal not found" });
    }
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Add the new amount to the goal's current amount
    goal.currentAmount += parseFloat(amountToAdd);

    // --- INTERCONNECTION LOGIC ---
    // If this goal is linked to a wishlist item, we must update it too.
    if (goal.wishlistItem) {
      const wishlistItem = await WishlistItem.findById(goal.wishlistItem);
      if (wishlistItem) {
        // The total amount saved for the item is the total saved in the goal
        wishlistItem.savedAmount = goal.currentAmount;
        await wishlistItem.save();
      }
    }
    // --- END INTERCONNECTION LOGIC ---

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
