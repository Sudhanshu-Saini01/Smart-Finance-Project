// client/src/features/income/IncomePage.jsx

// --- Core Imports ---
import React, { useContext } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";
import UniversalForm from "@/features/transactions/components/UniversalForm/UniversalForm";
// Note: We'll need to create a simple CSS file for this page later.
// import "./IncomePage.css";

// This configuration object defines the fields for the "Add Income Source" form.
// It will be passed to the UniversalForm component.
const incomeSourceFormConfig = [
  {
    name: "sourceName",
    label: "Income Source Name",
    placeholder: "e.g., Monthly Salary, Freelance Retainer",
    required: true,
  },
  {
    name: "amount",
    label: "Amount (₹)",
    type: "number",
    required: true,
  },
  {
    name: "frequency",
    label: "Frequency",
    type: "select",
    defaultValue: "monthly",
    options: [
      { value: "monthly", label: "Monthly" },
      { value: "weekly", label: "Weekly" },
      { value: "yearly", label: "Yearly" },
    ],
  },
  {
    name: "startDate",
    label: "First Payment Date",
    type: "date",
    defaultValue: new Date().toISOString().split("T")[0],
    required: true,
  },
];

/**
 * @component IncomePage
 * @desc      A dedicated page for users to add and manage their recurring income sources.
 */
const IncomePage = () => {
  // --- Context & State ---
  // Accessing the list of income sources and the refetch function from our global data context.
  const { incomeSources, loading, refetchData } = useContext(DataContext);

  // --- Event Handlers ---
  /**
   * @function handleAddIncomeSource
   * @desc     Handles the submission of the new income source form.
   */
  const handleAddIncomeSource = async (formData) => {
    try {
      // Makes an API call to our new backend endpoint to save the income source.
      await axios.post("http://localhost:3001/api/income-sources", formData);
      // Refreshes all application data to ensure the new source is displayed.
      refetchData();
    } catch (err) {
      console.error("Failed to add income source", err);
      alert("Failed to add income source. Please try again.");
    }
  };

  // --- JSX Render ---
  if (loading) {
    return <div className="loading-fullscreen">Loading Income Data...</div>;
  }

  return (
    <div className="si-page-container">
      {" "}
      {/* Reusing styles from Savings/Investments page for consistency */}
      <h1>Manage Your Income</h1>
      {/* Section for the form to add a new income source */}
      <div className="si-section">
        <UniversalForm
          title="Add a New Income Source"
          config={incomeSourceFormConfig}
          onSubmit={handleAddIncomeSource}
          submitText="+ Add Source"
        />
      </div>
      {/* Section to display the list of existing income sources */}
      <div className="si-section">
        <h3>Your Recurring Income Sources</h3>
        <div className="commitments-list">
          {" "}
          {/* Reusing styles for consistency */}
          {incomeSources && incomeSources.length > 0 ? (
            incomeSources.map((source) => (
              <div key={source._id} className="commitment-item">
                <div className="commitment-info">
                  <span className="commitment-name">{source.sourceName}</span>
                  <span className="commitment-type">{source.frequency}</span>
                </div>
                <strong className="commitment-amount income">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(source.amount)}
                </strong>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>You haven't added any recurring income sources yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomePage;
