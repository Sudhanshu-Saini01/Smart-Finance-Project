// client/src/pages/SavingsAndInvestmentsPage.jsx
//-------- Start: Version V3.0.0---------//

import React, { useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import UniversalForm from "../components/UniversalForm";
import InfoCard from "../components/InfoCard";
import "./SavingsAndInvestmentsPage.css";

// The "checklist" for creating a new recurring commitment
const commitmentFormConfig = [
  {
    name: "commitmentName",
    label: "Commitment Name",
    placeholder: "e.g., SBI Mutual Fund SIP",
    required: true,
  },
  {
    name: "amount",
    label: "Monthly Amount (₹)",
    type: "number",
    required: true,
  },
  {
    name: "commitmentType",
    label: "Type",
    type: "select",
    defaultValue: "savings",
    options: [
      { value: "savings", label: "Savings (e.g., RD, Emergency Fund)" },
      { value: "investment", label: "Investment (e.g., SIP, Stocks)" },
    ],
  },
  {
    name: "paymentDay",
    label: "Payment Day of Month",
    type: "number",
    placeholder: "e.g., 5",
    required: true,
  },
];

const SavingsAndInvestmentsPage = () => {
  const { commitments, investments, loading, error, refetchData } =
    useContext(DataContext);

  const handleCreateCommitment = async (formData) => {
    try {
      await axios.post("http://localhost:3001/api/commitments", formData);
      refetchData();
    } catch (err) {
      console.error("Failed to create commitment", err);
      alert("Failed to create commitment.");
    }
  };

  const totalMonthlyCommitments = commitments.reduce(
    (acc, com) => acc + com.amount,
    0
  );

  if (loading) {
    return <div className="loading-fullscreen">Loading Data...</div>;
  }

  return (
    <div className="si-page-container">
      <h1>Your Financial Blueprint</h1>

      <div className="si-pools-container">
        <div className="si-pool-card">
          <span>Total Monthly Commitments</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalMonthlyCommitments)}
          </strong>
        </div>
      </div>

      <div className="si-section">
        <UniversalForm
          title="Set Up a New Recurring Commitment"
          config={commitmentFormConfig}
          onSubmit={handleCreateCommitment}
          submitText="Create Commitment"
        />
      </div>

      <div className="si-section">
        <h3>Your Active Commitments</h3>
        <div className="commitments-list">
          {commitments && commitments.length > 0 ? (
            commitments.map((com) => (
              <div key={com._id} className="commitment-item">
                <span>{com.commitmentName}</span>
                <strong>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(com.amount)}{" "}
                  / month
                </strong>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>You have no recurring commitments set up.</p>
            </div>
          )}
        </div>
      </div>

      <div className="si-section">
        <h3>Your Investment Portfolio</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="investments-grid">
          {investments && investments.length > 0 ? (
            investments.map((inv) => (
              <InfoCard
                key={inv._id}
                title={inv.investmentName}
                primaryStats={[
                  {
                    label: "Amount Invested",
                    value: new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(inv.amountInvested),
                  },
                  { label: "Investment Type", value: inv.investmentType },
                ]}
                details={[
                  {
                    label: "Start Date",
                    value: new Date(inv.startDate).toLocaleDateString(),
                  },
                  { label: "Expected ROI", value: `${inv.expectedRoi}% p.a.` },
                ]}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>You have not made any specific investments yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsAndInvestmentsPage;
//-------- End: Version V3.0.0---------//
