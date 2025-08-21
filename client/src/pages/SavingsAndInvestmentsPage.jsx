// client/src/pages/SavingsAndInvestmentsPage.jsx
// /----- VERSION V2 -----/

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import "./SavingsAndInvestmentsPage.css"; // We will create this next

const SavingsAndInvestmentsPage = () => {
  const { user, investments, loading, error, refetchData } =
    useContext(DataContext);

  // Form state
  const [investmentName, setInvestmentName] = useState("");
  const [investmentType, setInvestmentType] = useState("Mutual Fund");
  const [amountInvested, setAmountInvested] = useState("");
  const [expectedRoi, setExpectedRoi] = useState("");
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
        expectedRoi: parseFloat(expectedRoi) || 0,
      });
      refetchData(); // Refetch all data to update pools and history
      setInvestmentName("");
      setAmountInvested("");
      setExpectedRoi("");
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
            <option>PPF</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            placeholder="Amount to Invest"
            value={amountInvested}
            onChange={(e) => setAmountInvested(e.target.value)}
          />
          <input
            type="number"
            placeholder="Expected ROI % (Optional)"
            value={expectedRoi}
            onChange={(e) => setExpectedRoi(e.target.value)}
          />
          <button type="submit">Invest</button>
        </form>
        {formError && <p className="error-message">{formError}</p>}
      </div>

      <div className="si-section">
        <h3>Your Portfolio</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="investments-list">
          {investments && investments.length > 0 ? (
            investments.map((inv) => (
              <div key={inv._id} className="investment-item">
                <div className="investment-info">
                  <span className="investment-name">{inv.investmentName}</span>
                  <span className="investment-type">{inv.investmentType}</span>
                </div>
                <div className="investment-details">
                  <span className="investment-roi">
                    Exp. ROI: {inv.expectedRoi}%
                  </span>
                  <strong className="investment-amount">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(inv.amountInvested)}
                  </strong>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>
                You have not made any investments yet.Use the form above to
                start building your portfolio!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsAndInvestmentsPage;
// /----- END VERSION V2 -----/
