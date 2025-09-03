// client/src/features/goals/components/GoalCard.jsx

import React, { useContext, useMemo } from "react";
import { DataContext } from "@/context/DataContext";
import "./GoalCard.css"; // We will create this file next.

/**
 * @component GoalCard
 * @desc      A smart card that displays a single financial goal, its progress,
 * and automatically calculates its estimated completion date based on linked recurrings.
 * @param {object} { goal } - The goal object to display.
 */
const GoalCard = ({ goal }) => {
  // --- Context & State ---
  // We access the global list of recurrings to find the one linked to this goal.
  const { recurrings } = useContext(DataContext);

  // --- Data Processing & Calculations ---
  // `useMemo` is a performance hook. This logic runs only when the goal or recurrings change.
  const fundingRecurring = useMemo(() => {
    // This finds the specific recurring savings recurring that is linked to this goal.
    return recurrings.find((c) => c.linkedGoal === goal._id);
  }, [recurrings, goal._id]);

  // This calculates the estimated number of months needed to reach the goal.
  const monthsToComplete = useMemo(() => {
    if (!fundingRecurring || fundingRecurring.amount <= 0) {
      return null; // Return null if there's no funding or the amount is zero.
    }
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    if (remainingAmount <= 0) return 0; // Goal is already complete.
    // The result is rounded up to ensure we account for the final partial month.
    return Math.ceil(remainingAmount / fundingRecurring.amount);
  }, [goal, fundingRecurring]);

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
          {fundingRecurring ? (
            <>
              <p>
                <strong>Funding:</strong>{" "}
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(fundingRecurring.amount)}{" "}
                / {fundingRecurring.frequency}
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
