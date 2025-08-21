// client/src/components/GoalCard.jsx
// /----- VERSION V2 -----/

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import "./GoalCard.css";

const GoalCard = ({ goal, onFundAdded }) => {
  const { user } = useContext(DataContext);
  const { _id, goalName, targetAmount, currentAmount, imageUrl, priority } =
    goal;
  const [amountToAdd, setAmountToAdd] = useState("");
  const [sourceType, setSourceType] = useState("savings");
  const [error, setError] = useState("");

  const progress = (currentAmount / targetAmount) * 100;
  // const remainingAmount = targetAmount - currentAmount;

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setError("");
    const amount = parseFloat(amountToAdd);
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (sourceType === "savings" && amount > user.unallocatedSavings) {
      setError("Insufficient savings funds.");
      return;
    }
    if (sourceType === "investments" && amount > user.unallocatedInvestments) {
      setError("Insufficient investment funds.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/goals/${_id}/add-funds`, {
        amount,
        sourceType,
      });
      setAmountToAdd("");
      onFundAdded();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add funds.");
    }
  };

  return (
    <div className={`goal-card priority-${priority}`}>
      <img src={imageUrl} alt={goalName} className="goal-card-image" />
      <div className="goal-card-content">
        <div className="goal-card-header">
          <h3>{goalName}</h3>
          <span className={`priority-pill priority-${priority}`}>
            {priority} priority
          </span>
        </div>
        <div className="goal-card-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress-text">
            <span>
              Saved:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(currentAmount)}
            </span>
            <span>
              Target:{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(targetAmount)}
            </span>
          </div>
        </div>
        <form onSubmit={handleAddFunds} className="goal-card-form">
          <input
            type="number"
            placeholder="Amount"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
          />
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
          >
            <option value="savings">From Savings</option>
            <option value="investments">From Investments</option>
          </select>
          <button type="submit">Add Funds</button>
        </form>
        {error && <p className="error-message-small">{error}</p>}
      </div>
    </div>
  );
};

export default GoalCard;
// /----- END VERSION V2 -----/
