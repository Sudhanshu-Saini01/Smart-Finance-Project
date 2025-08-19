// client/src/components/TransactionForm.jsx (UPDATE THIS FILE)

import React, { useState } from "react";
import axios from "axios";

const TransactionForm = ({ onTransactionAdded }) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Other"); // New state
  const [occurrence, setOccurrence] = useState("one-time"); // New state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // New state for date
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!description || !amount || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const newTransaction = {
        description,
        amount: parseFloat(amount),
        type,
        category,
        occurrence,
        date,
      };

      await axios.post(
        "http://localhost:3001/api/transactions",
        newTransaction
      );
      onTransactionAdded(); // Notify parent to refetch all data

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("Other");
    } catch (err) {
      setError("Failed to add transaction.");
      console.error(err);
    }
  };

  // Example categories
  const expenseCategories = [
    "Groceries",
    "Rent",
    "Utilities",
    "Transport",
    "Entertainment",
    "Savings",
    "Investment",
  ];
  const incomeCategories = ["Salary", "Freelance", "Bonus", "Other"];

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {type === "expense"
            ? expenseCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            : incomeCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
        </select>
      </div>
      <div className="form-group">
        <label>Occurrence</label>
        <select
          value={occurrence}
          onChange={(e) => setOccurrence(e.target.value)}
        >
          <option value="one-time">One-Time</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
