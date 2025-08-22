// client/src/pages/LoansPage.jsx
//-------- Start: Version V3.0.0---------//

import React, { useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import InfoCard from "../components/InfoCard";
import UniversalForm from "../components/UniversalForm";
import "./LoansPage.css";

const loanFormConfig = [
  {
    name: "loanName",
    label: "Loan Name",
    placeholder: "e.g., Car Loan",
    required: true,
  },
  {
    name: "lender",
    label: "Lender",
    placeholder: "e.g., SBI Bank",
    required: true,
  },
  {
    name: "totalAmount",
    label: "Total Amount (₹)",
    type: "number",
    required: true,
  },
  {
    name: "interestRate",
    label: "Interest Rate (%)",
    type: "number",
    required: true,
  },
  { name: "emi", label: "Monthly EMI (₹)", type: "number", required: true },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
    defaultValue: new Date().toISOString().split("T")[0],
  },
  { name: "endDate", label: "End Date", type: "date", required: true },
  {
    name: "assetType",
    label: "Asset Type",
    type: "select",
    defaultValue: "neutral",
    options: [
      { value: "depreciating", label: "Depreciating (Car, Electronics)" },
      { value: "appreciating", label: "Appreciating (Property)" },
      { value: "neutral", label: "Neutral (Education, Personal)" },
    ],
  },
];

const LoansPage = () => {
  const { loans, loading, error, refetchData } = useContext(DataContext);

  const handleAddLoan = async (formData) => {
    try {
      await axios.post("http://localhost:3001/api/loans", formData);
      refetchData();
    } catch (err) {
      console.error("Failed to add loan", err);
      alert("Failed to add loan.");
    }
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Loans...</div>;
  }

  return (
    <div className="loans-page-container">
      <h1>Loan Management</h1>
      <div className="loans-section">
        <UniversalForm
          title="Add a New Loan"
          config={loanFormConfig}
          onSubmit={handleAddLoan}
          submitText="Add Loan"
        />
      </div>
      <div className="loans-section">
        <h3>Your Active Loans</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="loans-grid">
          {loans && loans.length > 0 ? (
            loans.map((loan) => (
              <InfoCard
                key={loan._id}
                title={loan.loanName}
                primaryStats={[
                  {
                    label: "Remaining",
                    value: new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(loan.totalAmount - loan.amountPaid),
                  },
                  {
                    label: "Monthly EMI",
                    value: new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(loan.emi),
                  },
                ]}
                progress={(loan.amountPaid / loan.totalAmount) * 100}
                details={[
                  { label: "Lender", value: loan.lender },
                  {
                    label: "Interest Rate",
                    value: `${loan.interestRate}% p.a.`,
                  },
                  {
                    label: "End Date",
                    value: new Date(loan.endDate).toLocaleDateString(),
                  },
                ]}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>You have no active loans. Congratulations!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
//-------- End: Version V3.0.0---------//
