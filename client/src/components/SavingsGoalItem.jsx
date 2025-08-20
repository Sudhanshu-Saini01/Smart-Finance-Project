// client/src/components/SavingsGoalItem.jsx

import React, { useState } from "react";
import axios from "axios";
import "./SavingsGoalItem.css"; // We will create this next

const SavingsGoalItem = ({ goal, onFundAdded }) => {
  const { _id, goalName, targetAmount, currentAmount, wishlistItem } = goal;
  const [amountToAdd, setAmountToAdd] = useState("");
  const [error, setError] = useState("");

  const progress = (currentAmount / targetAmount) * 100;

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!amountToAdd || parseFloat(amountToAdd) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    try {
      await axios.put(`http://localhost:3001/api/savings/${_id}`, {
        amountToAdd: parseFloat(amountToAdd),
      });
      setAmountToAdd("");
      setError("");
      onFundAdded(); // This tells the parent page to refetch all data
    } catch (err) {
      setError("Failed to add funds.");
      console.error(err);
    }
  };

  return (
    <div className="goal-item-card">
      <div className="goal-info">
        <div className="goal-header">
          <h4>{goalName}</h4>
          {wishlistItem && (
            <span className="linked-item">
              Linked to: {wishlistItem.itemName}
            </span>
          )}
        </div>
        <div className="goal-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>${currentAmount.toFixed(2)}</span>
            <span>Target: ${targetAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleAddFunds} className="add-funds-form">
        <input
          type="number"
          placeholder="Amount"
          value={amountToAdd}
          onChange={(e) => setAmountToAdd(e.target.value)}
        />
        <button type="submit">Add Funds</button>
        {error && <p className="error-message-small">{error}</p>}
      </form>
    </div>
  );
};

export default SavingsGoalItem;
