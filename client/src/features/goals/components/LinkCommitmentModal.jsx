// client/src/features/goals/components/LinkCommitmentModal.jsx

import React, { useState, useContext, useMemo } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";
import "./LinkCommitmentModal.css"; // We will create this file next.

/**
 * @component LinkCommitmentModal
 * @desc      A modal that allows a user to link a new goal to an existing savings commitment.
 * @param {boolean} isOpen - Controls if the modal is visible.
 * @param {function} onClose - Function to call to close the modal.
 * @param {object} goal - The newly created goal object that needs to be linked.
 */
const LinkCommitmentModal = ({ isOpen, onClose, goal }) => {
  // --- Context & State ---
  const { commitments, refetchData } = useContext(DataContext);
  // This state will hold the ID of the commitment the user selects from the dropdown.
  const [selectedCommitmentId, setSelectedCommitmentId] = useState("");
  const [error, setError] = useState("");

  // --- Data Processing ---
  // This logic filters the user's commitments to find only the ones that are:
  // 1. A "savings" type.
  // 2. Not already linked to another goal.
  // `useMemo` is used for performance so this list is only recalculated when necessary.
  const availableCommitments = useMemo(() => {
    return commitments.filter(
      (c) => c.commitmentType === "savings" && !c.linkedGoal
    );
  }, [commitments]);

  // --- Event Handlers ---
  const handleLinkCommitment = async () => {
    if (!selectedCommitmentId) {
      setError("Please select a savings plan to link.");
      return;
    }
    setError("");

    try {
      // This makes an API call to a new endpoint that we will need to create on the server.
      // It tells the server to update the specified commitment and set its `linkedGoal` field.
      await axios.put(
        `http://localhost:3001/api/commitments/${selectedCommitmentId}/link-goal`,
        { goalId: goal._id }
      );
      // After successfully linking, we refresh all app data and close the modal.
      await refetchData();
      onClose();
    } catch (err) {
      console.error("Failed to link commitment", err);
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
        {availableCommitments.length === 0 ? (
          <div className="empty-state">
            <p>You have no available savings plans to link.</p>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="commitment-select">Available Savings Plans</label>
            <select
              id="commitment-select"
              value={selectedCommitmentId}
              onChange={(e) => setSelectedCommitmentId(e.target.value)}
            >
              <option value="">-- Select a Plan --</option>
              {availableCommitments.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.commitmentName} (
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
            onClick={handleLinkCommitment}
            className="btn-primary"
            disabled={
              !selectedCommitmentId || availableCommitments.length === 0
            }
          >
            Link Savings Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkCommitmentModal;
