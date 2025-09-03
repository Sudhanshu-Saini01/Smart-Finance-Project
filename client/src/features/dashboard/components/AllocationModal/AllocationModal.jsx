// client/src/components/AllocationModal.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllocationModal.css";

const AllocationModal = ({ isOpen, onClose, incomeTransaction, onApply }) => {
  const [expense, setExpense] = useState(70);
  const [savings, setSavings] = useState(20);
  const [investment, setInvestment] = useState(10);

  useEffect(() => {
    if (incomeTransaction) {
      if (incomeTransaction.amount > 75000) {
        setExpense(50);
        setSavings(20);
        setInvestment(30);
      } else if (incomeTransaction.amount < 30000) {
        setExpense(80);
        setSavings(15);
        setInvestment(5);
      } else {
        setExpense(70);
        setSavings(20);
        setInvestment(10);
      }
    }
  }, [incomeTransaction]);

  if (!isOpen || !incomeTransaction) return null;

  const handleSliderChange = (type, value) => {
    // This is a simplified logic. A more complex one could adjust the other two.
    if (type === "expense") setExpense(value);
    if (type === "savings") setSavings(value);
    if (type === "investment") setInvestment(value);
  };

  // /----- VERSION V2.1: Allocation Fix -----/
  const handleApply = async () => {
    try {
      // Send the new ratio to the new backend endpoint
      await axios.post("https://smart-finance-project.onrender.com/api/transactions/allocate", {
        incomeId: incomeTransaction._id,
        allocations: {
          savings,
          investment,
        },
      });
      onApply(); // This will call refetchData to update the entire app
      onClose();
    } catch (error) {
      console.error("Failed to apply allocations", error);
    }
  };
  // /----- END VERSION V2.1 -----/

  const total = expense + savings + investment;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Allocate Your Income</h2>
        <p>
          Your income of{" "}
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(incomeTransaction.amount)}
          </strong>{" "}
          has been credited.
        </p>
        <p>As your advisor, I suggest the following allocation:</p>

        <div className="allocation-sliders">
          <div className="slider-group">
            <label>For Expenses: {expense}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={expense}
              onChange={(e) =>
                handleSliderChange("expense", Number(e.target.value))
              }
            />
          </div>
          <div className="slider-group">
            <label>For Savings: {savings}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={savings}
              onChange={(e) =>
                handleSliderChange("savings", Number(e.target.value))
              }
            />
          </div>
          <div className="slider-group">
            <label>For Investment: {investment}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={investment}
              onChange={(e) =>
                handleSliderChange("investment", Number(e.target.value))
              }
            />
          </div>
        </div>

        <p className={`total-percent ${total !== 100 ? "error" : ""}`}>
          {total !== 100 ? `Total must be 100%` : `Total: 100%`}
        </p>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Skip
          </button>
          <button
            onClick={handleApply}
            className="btn-primary"
            disabled={total !== 100}
          >
            Apply Allocation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocationModal;
