// client/src/components/TransactionForm.jsx (FIXED)

import React, { useState } from "react";
import axios from "axios";
import "./TransactionForm.css";

const TransactionForm = ({
  onTransactionAdded,
  onIncomeAdded,
  wishlistItems,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Other");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
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
        date,
      };
      const res = await axios.post(
        "http://localhost:3001/api/transactions",
        newTransaction
      );

      if (type === "income" && onIncomeAdded) {
        onIncomeAdded(res.data[0]);
      } else {
        onTransactionAdded();
      }

      setDescription("");
      setAmount("");
      setCategory("Other");
    } catch (err) {
      setError("Failed to add transaction.", err);
    }
  };

  const expenseCategories = [
    "Groceries",
    "Rent",
    "Utilities",
    "Transport",
    "Entertainment",
  ];
  const incomeCategories = ["Salary", "Freelance", "Bonus", "Other"];
  // 3. ADD 'savings' and 'investment' to the type dropdown
  const transactionTypes = ["expense", "income", "savings", "investment"];

  return (
    <form onSubmit={handleSubmit} className="compact-transaction-form">
      {error && <p className="error-message full-width">{error}</p>}
      <div className="form-group">
        <label>{type === "income" ? "Source" : "Spent On"}</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Amount (₹)</label>
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
          {transactionTypes.map((t) => (
            <option key={t} value={t} style={{ textTransform: "capitalize" }}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <optgroup label="General">
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
          </optgroup>
          {/* 4. MAP OVER 'wishlistItems' (which now contains goals) and use 'goalName' */}
          <optgroup label="Goals">
            {wishlistItems &&
              wishlistItems.map((item) => (
                <option key={item._id} value={item.goalName}>
                  {item.goalName}
                </option>
              ))}
          </optgroup>
        </select>
      </div>
      <button type="submit" className="submit-btn">
        Add
      </button>
    </form>
  );
};

export default TransactionForm;
