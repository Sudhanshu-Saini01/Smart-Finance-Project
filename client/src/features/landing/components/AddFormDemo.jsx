// client/src/features/landing/components/AddFormDemo.jsx

import React, { useState } from "react";
import "./AddFormDemo.css"; // We'll create this next

const AddFormDemo = () => {
  const [formType, setFormType] = useState(null);

  if (formType) {
    return (
      <div className="add-form-container">
        <button className="form-back-btn" onClick={() => setFormType(null)}>
          ← Back
        </button>
        <h3>Add New {formType.charAt(0).toUpperCase() + formType.slice(1)}</h3>
        {formType === "expense" && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="e.g., 500.00" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder="e.g., Lunch with team" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select>
                <option>Food</option>
                <option>Transport</option>
              </select>
            </div>
            <button type="submit" className="form-submit-btn">
              Add Expense
            </button>
          </form>
        )}
        {formType === "income" && (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" placeholder="e.g., 50000.00" />
            </div>
            <div className="form-group">
              <label>Source</label>
              <input type="text" placeholder="e.g., Monthly Salary" />
            </div>
            <button type="submit" className="form-submit-btn">
              Add Income
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="add-form-container">
      <h3>What would you like to add?</h3>
      <div className="form-type-selector">
        <div className="type-card" onClick={() => setFormType("expense")}>
          <span className="type-icon">💸</span>
          <span>Expense</span>
        </div>
        <div className="type-card" onClick={() => setFormType("income")}>
          <span className="type-icon">💰</span>
          <span>Income</span>
        </div>
        <div className="type-card disabled">
          <span className="type-icon">🏦</span>
          <span>Saving</span>
        </div>
        <div className="type-card disabled">
          <span className="type-icon">📈</span>
          <span>Investment</span>
        </div>
      </div>
    </div>
  );
};

export default AddFormDemo;
