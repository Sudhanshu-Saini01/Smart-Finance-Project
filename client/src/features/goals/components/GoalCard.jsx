// client/src/features/goals/components/GoalCard.jsx

import React, { useContext, useMemo } from "react";
import { DataContext } from "@/context/DataContext";
import "./GoalCard.css"; // We will create this file next.

/**
 * @component GoalCard
 * @desc      A smart card that displays a single financial goal, its progress,
 * and automatically calculates its estimated completion date based on linked commitments.
 * @param {object} { goal } - The goal object to display.
 */
const GoalCard = ({ goal }) => {
  // --- Context & State ---
  // We access the global list of commitments to find the one linked to this goal.
  const { commitments } = useContext(DataContext);

  // --- Data Processing & Calculations ---
  // `useMemo` is a performance hook. This logic runs only when the goal or commitments change.
  const fundingCommitment = useMemo(() => {
    // This finds the specific recurring savings commitment that is linked to this goal.
    return commitments.find((c) => c.linkedGoal === goal._id);
  }, [commitments, goal._id]);

  // This calculates the estimated number of months needed to reach the goal.
  const monthsToComplete = useMemo(() => {
    if (!fundingCommitment || fundingCommitment.amount <= 0) {
      return null; // Return null if there's no funding or the amount is zero.
    }
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    if (remainingAmount <= 0) return 0; // Goal is already complete.
    // The result is rounded up to ensure we account for the final partial month.
    return Math.ceil(remainingAmount / fundingCommitment.amount);
  }, [goal, fundingCommitment]);

  // This calculates the estimated completion date.
  const completionDate = useMemo(() => {
    if (monthsToComplete === null) return null;
    const date = new Date();
    // It adds the calculated number of months to the current date.
    date.setMonth(date.getMonth() + monthsToComplete);
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }, [monthsToComplete]);

  // --- JSX Render ---
  return (
    <div className="goal-card">
      <img
        src={goal.imageUrl}
        alt={goal.goalName}
        className="goal-card-image"
      />
      <div className="goal-card-content">
        <h3>{goal.goalName}</h3>
        <div className="goal-card-progress">
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
              }}
            ></div>
          </div>
          <div className="progress-text">
            <strong>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(goal.currentAmount)}
            </strong>
            <span>
              {" "}
              /{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(goal.targetAmount)}
            </span>
          </div>
        </div>
        <div className="goal-card-details">
          {/* This section dynamically displays the funding information. */}
          {fundingCommitment ? (
            <>
              <p>
                <strong>Funding:</strong>{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(fundingCommitment.amount)}{" "}
                / {fundingCommitment.frequency}
              </p>
              {completionDate && (
                <p>
                  <strong>Est. Completion:</strong> {completionDate}
                </p>
              )}
            </>
          ) : (
            // This message appears if no recurring payment is linked to the goal.
            <p className="no-funding-warning">
              No recurring contribution is linked to this goal.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
