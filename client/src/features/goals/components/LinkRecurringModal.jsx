// client/src/features/goals/components/LinkRecurringModal.jsx

import React, { useState, useContext, useMemo } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";
import "./LinkRecurringModal.css"; // We will create this file next.

/**
 * @component LinkRecurringModal
 * @desc      A modal that allows a user to link a new goal to an existing savings recurring.
 * @param {boolean} isOpen - Controls if the modal is visible.
 * @param {function} onClose - Function to call to close the modal.
 * @param {object} goal - The newly created goal object that needs to be linked.
 */
const LinkRecurringModal = ({ isOpen, onClose, goal }) => {
  // --- Context & State ---
  const { recurrings, refetchData } = useContext(DataContext);
  // This state will hold the ID of the recurring the user selects from the dropdown.
  const [selectedRecurringId, setSelectedRecurringId] = useState("");
  const [error, setError] = useState("");

  // --- Data Processing ---
  // This logic filters the user's recurrings to find only the ones that are:
  // 1. A "savings" type.
  // 2. Not already linked to another goal.
  // `useMemo` is used for performance so this list is only recalculated when necessary.
  const availableRecurrings = useMemo(() => {
    return recurrings.filter(
      (c) => c.recurringType === "savings" && !c.linkedGoal
    );
  }, [recurrings]);

  // --- Event Handlers ---
  const handleLinkRecurring = async () => {
    if (!selectedRecurringId) {
      setError("Please select a savings plan to link.");
      return;
    }
    setError("");

    try {
      // This makes an API call to a new endpoint that we will need to create on the server.
      // It tells the server to update the specified recurring and set its `linkedGoal` field.
      await axios.put(
        `http://smart-finance-project.onrender.com/api/recurrings/${selectedRecurringId}/link-goal`,
        { goalId: goal._id }
      );
      // After successfully linking, we refresh all app data and close the modal.
      await refetchData();
      onClose();
    } catch (err) {
      console.error("Failed to link recurring", err);
      setError("Failed to link the savings plan. Please try again.");
    }
  };

  // If the modal is not supposed to be open, render nothing.
  if (!isOpen) return null;

  // --- JSX Render ---
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Link to an Existing Savings Plan</h2>
        <p>
          Select one of your existing savings plans to automatically fund your
          goal: <strong>"{goal.goalName}"</strong>.
        </p>

        {/* If the user has no available savings plans, we show a helpful message. */}
        {availableRecurrings.length === 0 ? (
          <div className="empty-state">
            <p>You have no available savings plans to link.</p>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="recurring-select">Available Savings Plans</label>
            <select
              id="recurring-select"
              value={selectedRecurringId}
              onChange={(e) => setSelectedRecurringId(e.target.value)}
            >
              <option value="">-- Select a Plan --</option>
              {availableRecurrings.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.recurringName} (
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(c.amount)}{" "}
                  / {c.frequency})
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          {/* The "Link" button is disabled if no plan is selected or if none are available. */}
          <button
            onClick={handleLinkRecurring}
            className="btn-primary"
            disabled={!selectedRecurringId || availableRecurrings.length === 0}
          >
            Link Savings Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkRecurringModal;
