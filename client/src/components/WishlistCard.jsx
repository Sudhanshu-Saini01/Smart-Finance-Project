// client/src/components/WishlistCard.jsx (NEW FILE)

import React from "react";

// Import or define URLs for your category images
const categoryImages = {
  electronics:
    "[https://placehold.co/600x400/007bff/FFF?text=Electronics](https://placehold.co/600x400/007bff/FFF?text=Electronics)",
  vehicle:
    "[https://placehold.co/600x400/28a745/FFF?text=Vehicle](https://placehold.co/600x400/28a745/FFF?text=Vehicle)",
  property:
    "[https://placehold.co/600x400/dc3545/FFF?text=Property](https://placehold.co/600x400/dc3545/FFF?text=Property)",
  vacation:
    "[https://placehold.co/600x400/ffc107/FFF?text=Vacation](https://placehold.co/600x400/ffc107/FFF?text=Vacation)",
  other:
    "[https://placehold.co/600x400/6c757d/FFF?text=Other](https://placehold.co/600x400/6c757d/FFF?text=Other)",
};

// const WishlistCard = ({ item, summary, onDelete }) => {
const WishlistCard = ({ item, summary }) => {
  const { itemName, itemPrice, savedAmount, category } = item;
  const progress = savedAmount > 0 ? (savedAmount / itemPrice) * 100 : 0;
  const remainingAmount = itemPrice - savedAmount;

  // --- Financial Advisor Logic ---
  const getAdvisorSuggestion = () => {
    const currentBalance =
      summary?.currentMonth?.totalIncome -
        summary?.currentMonth?.totalExpense || 0;

    if (savedAmount >= itemPrice) {
      return { text: "Congratulations! You can buy this now.", color: "blue" };
    }
    if (currentBalance >= remainingAmount) {
      return {
        text: "Eligible to Buy! Use your current monthly surplus.",
        color: "green",
      };
    }
    if (currentBalance > 0 && savedAmount + currentBalance >= itemPrice * 0.5) {
      const needed = (itemPrice - savedAmount - currentBalance).toFixed(2);
      return {
        text: `Consider a small loan. You only need $${needed} more.`,
        color: "yellow",
      };
    }
    return {
      text: "Focus on saving. You can't afford this yet.",
      color: "red",
    };
  };

  const suggestion = getAdvisorSuggestion();

  return (
    <div className="wishlist-card">
      <img
        src={categoryImages[category]}
        alt={category}
        className="card-image"
      />
      <div className="card-content">
        <h3 className="card-title">{itemName}</h3>
        <div className="card-price-info">
          <span className="total-cost">Total: ${itemPrice.toFixed(2)}</span>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="card-progress-text">
          <span>Saved: ${savedAmount.toFixed(2)}</span>
          <span>Rest: ${remainingAmount.toFixed(2)}</span>
        </div>

        <div className={`card-advisor-suggestion ${suggestion.color}`}>
          <p>{suggestion.text}</p>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
