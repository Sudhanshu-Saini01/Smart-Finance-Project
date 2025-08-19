// server/routes/wishlistRoutes.js (NEW FILE)

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const WishlistItem = require("../models/WishlistItem");

// @route   POST /api/wishlist
// @desc    Add an item to the wishlist
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { itemName, itemPrice } = req.body;
    const newItem = new WishlistItem({
      user: req.user.id,
      itemName,
      itemPrice,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/wishlist
// @desc    Get all items from the user's wishlist
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const items = await WishlistItem.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/wishlist/:id
// @desc    Delete an item from the wishlist
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await WishlistItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: "Item not found" });
    }
    // Ensure user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    await item.deleteOne(); // Use deleteOne() on the document
    res.json({ msg: "Item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
