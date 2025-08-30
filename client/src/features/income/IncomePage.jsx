// client/src/features/income/IncomePage.jsx

import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import Modal from "@/components/ui/Modal/Modal";
import IncomeSourceForm from "./components/IncomeSourceForm/IncomeSourceForm";
import IncomeSummary from "./components/IncomeSummary/IncomeSummary";
import IncomeList from "./components/IncomeList/IncomeList";
import "./IncomePage.css";

// Sample data for the empty state, as you requested
const sampleIncomeSources = [
  {
    _id: "s1",
    sourceName: "Sample Salary",
    incomeType: "Salary",
    grossAmount: 60000,
    netAmount: 50000,
  },
  {
    _id: "s2",
    sourceName: "Sample Freelance Project",
    incomeType: "Freelance",
    grossAmount: 15000,
    netAmount: 15000,
  },
];

const IncomePage = () => {
  const { incomeSources, loading } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  if (loading) {
    return <div className="loading-fullscreen">Loading Income...</div>;
  }

  const hasRealData = incomeSources.length > 0;

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <IncomeSourceForm onClose={() => setFormModalOpen(false)} />
      </Modal>

      <div className="income-page-container">
        <header className="page-header">
          <div>
            <h1>Income Hub</h1>
            <p>A complete and clear picture of all the money you earn.</p>
          </div>
          <button
            className="add-income-btn"
            onClick={() => setFormModalOpen(true)}
          >
            + Add Income Source
          </button>
        </header>

        <section className="page-section">
          <IncomeSummary
            incomeSources={hasRealData ? incomeSources : sampleIncomeSources}
          />
        </section>

        <section className="page-section">
          <h3>Your Income Sources</h3>
          <IncomeList
            incomeSources={hasRealData ? incomeSources : sampleIncomeSources}
            isSample={!hasRealData}
          />
        </section>
      </div>
    </>
  );
};

export default IncomePage;
