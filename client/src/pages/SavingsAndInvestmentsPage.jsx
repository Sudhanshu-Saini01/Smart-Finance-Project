// client/src/pages/SavingsAndInvestmentsPage.jsx (FIXED)

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import "./SavingsAndInvestmentsPage.css";

const SavingsAndInvestmentsPage = () => {
  const { user, investments, loading, error, refetchData } =
    useContext(DataContext);

  const [investmentName, setInvestmentName] = useState("");
  const [investmentType, setInvestmentType] = useState("Mutual Fund");
  const [amountInvested, setAmountInvested] = useState("");
  const [formError, setFormError] = useState("");

  const handleCreateInvestment = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!investmentName || !amountInvested) {
      setFormError("Please fill all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/investments", {
        investmentName,
        investmentType,
        amountInvested: parseFloat(amountInvested),
      });
      refetchData();
      setInvestmentName("");
      setAmountInvested("");
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to create investment.");
    }
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Data...</div>;
  }

  return (
    <div className="si-page-container">
      <h1>Savings & Investments</h1>

      <div className="si-pools-container">
        <div className="si-pool-card">
          <span>Unallocated Savings</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(user?.unallocatedSavings || 0)}
          </strong>
        </div>
        <div className="si-pool-card">
          <span>Unallocated Investments</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(user?.unallocatedInvestments || 0)}
          </strong>
        </div>
      </div>

      <div className="si-section">
        <h3>Create a New Investment</h3>
        <p>
          Use your "Unallocated Investments" funds to invest in various assets.
        </p>
        <form onSubmit={handleCreateInvestment} className="si-form">
          <input
            type="text"
            placeholder="Investment Name (e.g., SBI Bluechip Fund)"
            value={investmentName}
            onChange={(e) => setInvestmentName(e.target.value)}
          />
          <select
            value={investmentType}
            onChange={(e) => setInvestmentType(e.target.value)}
          >
            <option>Mutual Fund</option>
            <option>Stock</option>
            <option>Fixed Deposit</option>
            <option>Recurring Deposit</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            placeholder="Amount to Invest"
            value={amountInvested}
            onChange={(e) => setAmountInvested(e.target.value)}
          />
          <button type="submit">Invest</button>
        </form>
        {formError && <p className="error-message">{formError}</p>}
      </div>

      <div className="si-section">
        <h3>Your Portfolio</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="investments-list">
          {/* Defensive Check: Make sure 'investments' exists before trying to map it */}
          {investments && investments.length > 0 ? (
            investments.map((inv) => (
              <div key={inv._id} className="investment-item">
                <span>
                  {inv.investmentName} ({inv.investmentType})
                </span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(inv.amountInvested)}
                </strong>
              </div>
            ))
          ) : (
            <p>You have not made any investments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsAndInvestmentsPage;
