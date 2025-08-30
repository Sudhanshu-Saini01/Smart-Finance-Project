// client/src/features/savings/components/SavingsGoalCard/SavingsGoalCard.jsx
import React from "react";
import "./SavingsGoalCard.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const SavingsGoalCard = ({ goal }) => {
  // Use a placeholder for currentAmount if not provided by the backend
  const currentAmount = goal.currentAmount || goal.targetAmount * 0.45; // Simulate 45% progress
  const progressPercent = (currentAmount / goal.targetAmount) * 100;

  return (
    <div className="goal-card">
      <div className="card-image-container">
        <img
          src={
            goal.imageUrl ||
            "https://placehold.co/400x200/a5b4fc/ffffff?text=Goal"
          }
          alt={goal.goalName}
        />
      </div>
      <div className="card-content">
        <h4>{goal.goalName}</h4>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span>{formatCurrency(currentAmount)}</span>
          <span className="target-amount">
            of {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoalCard;
