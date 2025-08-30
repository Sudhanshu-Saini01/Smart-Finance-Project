// client/src/features/insurance/components/InsuranceForm/InsuranceForm.jsx
import React from "react";
import "./InsuranceForm.css";

const InsuranceForm = ({ onClose }) => {
  return (
    <div className="insurance-form-container">
      <h3>Add New Insurance Policy</h3>
      <form>
        <div className="form-group">
          <label>Policy Name</label>
          <input type="text" placeholder="e.g., Family Health Plan" />
        </div>
        <div className="form-group">
          <label>Provider</label>
          <input type="text" placeholder="e.g., HDFC Ergo" />
        </div>
        <div className="form-group">
          <label>Coverage Amount</label>
          <input type="number" placeholder="e.g., 1000000" />
        </div>
        <div className="form-group">
          <label>Premium</label>
          <input type="number" placeholder="e.g., 15000" />
        </div>
        <div className="form-group">
          <label>Next Due Date</label>
          <input type="date" />
        </div>
        <button type="submit" className="form-submit-btn">
          Save Policy
        </button>
      </form>
    </div>
  );
};

export default InsuranceForm;
