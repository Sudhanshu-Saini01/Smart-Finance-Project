// client/src/features/investments/components/InvestmentForm/InvestmentForm.jsx
// This is a placeholder form. We would add state and API call logic here.
import React from 'react';
import './InvestmentForm.css';

const InvestmentForm = ({ onClose }) => {
  return (
    <div className="investment-form-container">
      <h3>Add New Investment</h3>
      <form>
        <div className="form-group"><label>Investment Name</label><input type="text" placeholder="e.g., Reliance Growth Fund" /></div>
        <div className="form-group"><label>Investment Type</label><input type="text" placeholder="e.g., Mutual Fund" /></div>
        <div className="form-group"><label>Amount Invested</label><input type="number" placeholder="e.g., 10000" /></div>
        <button type="submit" className="form-submit-btn">Save Investment</button>
      </form>
    </div>
  );
};

export default InvestmentForm;