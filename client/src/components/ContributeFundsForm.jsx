// client/src/components/ContributeFundsForm.jsx
// /----- VERSION V3 -----/

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";

const ContributeFundsForm = ({ goalId, onFundAdded }) => {
  const { user } = useContext(DataContext);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [sourceType, setSourceType] = useState("savings");
  const [error, setError] = useState("");

  const handleAddFunds = async (e) => {
    e.preventDefault();
    setError("");
    const amount = parseFloat(amountToAdd);
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (sourceType === "savings" && amount > user.unallocatedSavings) {
      setError("Insufficient savings funds.");
      return;
    }
    if (sourceType === "investments" && amount > user.unallocatedInvestments) {
      setError("Insufficient investment funds.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/goals/${goalId}/add-funds`, {
        amount,
        sourceType,
      });
      setAmountToAdd("");
      onFundAdded();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add funds.");
    }
  };

  return (
    <form onSubmit={handleAddFunds} className="contribute-form">
      <div className="form-inputs">
        <input
          type="number"
          placeholder="Amount"
          value={amountToAdd}
          onChange={(e) => setAmountToAdd(e.target.value)}
        />
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
        >
          <option value="savings">From Savings</option>
          <option value="investments">From Investments</option>
        </select>
      </div>
      <button type="submit">Contribute</button>
      {error && <p className="error-message-small">{error}</p>}
    </form>
  );
};

export default ContributeFundsForm;
// /----- END VERSION V3 -----/
