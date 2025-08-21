// client/src/components/AllocationModal.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllocationModal.css";

const AllocationModal = ({ isOpen, onClose, incomeTransaction, onApply }) => {
  const [expense, setExpense] = useState(70);
  const [savings, setSavings] = useState(20);
  const [investment, setInvestment] = useState(10);

  // Financial Advisor Logic: Suggest a dynamic ratio based on income amount
  useEffect(() => {
    if (incomeTransaction) {
      if (incomeTransaction.amount > 75000) {
        // High income
        setExpense(50);
        setSavings(20);
        setInvestment(30);
      } else if (incomeTransaction.amount < 30000) {
        // Low income
        setExpense(80);
        setSavings(15);
        setInvestment(5);
      } else {
        // Medium income
        setExpense(70);
        setSavings(20);
        setInvestment(10);
      }
    }
  }, [incomeTransaction]);

  if (!isOpen || !incomeTransaction) return null;

  const handleApply = async () => {
    try {
      // Create the new savings and investment transactions based on the final ratio
      const savingsAmount = incomeTransaction.amount * (savings / 100);
      const investmentAmount = incomeTransaction.amount * (investment / 100);

      const transactionsToCreate = [];
      if (savingsAmount > 0) {
        transactionsToCreate.push(
          axios.post("http://localhost:3001/api/transactions", {
            description: `Auto-allocated Savings from ${incomeTransaction.description}`,
            amount: savingsAmount,
            type: "expense",
            category: "Savings",
            date: incomeTransaction.date,
          })
        );
      }
      if (investmentAmount > 0) {
        transactionsToCreate.push(
          axios.post("http://localhost:3001/api/transactions", {
            description: `Auto-allocated Investment from ${incomeTransaction.description}`,
            amount: investmentAmount,
            type: "expense",
            category: "Investment",
            date: incomeTransaction.date,
          })
        );
      }

      await Promise.all(transactionsToCreate);
      onApply(); // This will call refetchData
      onClose();
    } catch (error) {
      console.error("Failed to apply allocations", error);
    }
  };

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
            <label>Expenses: {expense}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
            />
          </div>
          <div className="slider-group">
            <label>Savings: {savings}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
            />
          </div>
          <div className="slider-group">
            <label>Investment: {investment}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
            />
          </div>
        </div>

        <p className={`total-percent ${total !== 100 ? "error" : ""}`}>
          Total: {total}%
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
