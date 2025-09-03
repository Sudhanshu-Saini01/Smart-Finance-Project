// client/src/features/goals/components/FundingChoiceModal.jsx

import React from "react";
// We can reuse the same CSS as the LinkRecurringModal for a consistent style.
import "./LinkRecurringModal.css";

/**
 * @component FundingChoiceModal
 * @desc      A modal that asks the user how they want to fund their newly created goal.
 * @param {boolean} isOpen - Controls if the modal is visible.
 * @param {function} onLink - Function to call when the user chooses to link an existing plan.
 * @param {function} onNew - Function to call when the user chooses to create a new plan.
 * @param {function} onClose - Function to call to close the modal.
 * @param {object} goal - The newly created goal object.
 */
const FundingChoiceModal = ({ isOpen, onLink, onNew, onClose, goal }) => {
  if (!isOpen || !goal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Goal Created!</h2>
        <p>
          Your goal "<strong>{goal.goalName}</strong>" has been successfully
          created. How would you like to fund it?
        </p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            I'll Decide Later
          </button>
          <button onClick={onNew} className="btn-secondary">
            Create New Savings Plan
          </button>
          <button onClick={onLink} className="btn-primary">
            Link Existing Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundingChoiceModal;
