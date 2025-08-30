// client/src/features/savings/components/SavingsForm/SavingsForm.jsx
import React from "react";
import "./SavingsForm.css";

const SavingsForm = ({ onClose }) => {
  return (
    <div className="savings-form-container">
      <h3>Create New Savings Goal</h3>
      <form>
        <div className="form-group">
          <label>Goal Name</label>
          <input type="text" placeholder="e.g., Europe Trip" />
        </div>
        <div className="form-group">
          <label>Target Amount</label>
          <input type="number" placeholder="e.g., 200000" />
        </div>
        <button type="submit" className="form-submit-btn">
          Save Goal
        </button>
      </form>
    </div>
  );
};

export default SavingsForm;
