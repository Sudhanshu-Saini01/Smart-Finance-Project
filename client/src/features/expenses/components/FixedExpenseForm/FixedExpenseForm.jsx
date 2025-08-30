// client/src/features/expenses/components/FixedExpenseForm/FixedExpenseForm.jsx
import React from "react";
import "./FixedExpenseForm.css";

const FixedExpenseForm = ({ onClose }) => {
  return (
    <div className="expense-form-container">
      <h3>Add New Fixed Expense</h3>
      <form>
        <div className="form-group">
          <label>Expense Name</label>
          <input type="text" placeholder="e.g., Netflix Subscription" />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" placeholder="e.g., 499" />
        </div>
        <div className="form-group">
          <label>Next Due Date</label>
          <input type="date" />
        </div>
        <button type="submit" className="form-submit-btn">
          Save Expense
        </button>
      </form>
    </div>
  );
};
export default FixedExpenseForm;
