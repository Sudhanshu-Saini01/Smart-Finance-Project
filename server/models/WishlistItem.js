// server/models/WishlistItem.js (UPDATE THIS FILE)

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistItemSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    // NEW FIELD: To track progress towards this item
    savedAmount: {
      type: Number,
      default: 0,
    },
    // NEW FIELD: For displaying category-specific images/icons on the frontend
    category: {
      type: String,
      enum: ["electronics", "vehicle", "property", "vacation", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["planning", "achieved"],
      default: "planning",
    },
  },
  {
    timestamps: true,
  }
);

const WishlistItem = mongoose.model("WishlistItem", wishlistItemSchema);

module.exports = WishlistItem;
