// client/src/features/investments/InvestmentsPage.jsx

import React, { useState, useContext, useMemo } from "react";
import { DataContext } from "@/context/DataContext";
import Modal from "@/components/ui/Modal/Modal";

import InvestmentOverview from "./components/InvestmentOverview/InvestmentOverview";
import InvestmentHoldingsList from "./components/InvestmentHoldingsList/InvestmentHoldingsList";
import InvestmentForm from "./components/InvestmentForm/InvestmentForm";
// We'll create InvestmentsPage.css in the next step
import './InvestmentsPage.css';

const InvestmentsPage = () => {
  const { investments, loading } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  // Calculate portfolio totals
  const portfolioStats = useMemo(() => {
    const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
    // In a real app, 'currentValue' would come from an API. For now, we'll simulate a 15% gain.
    const currentValue = totalInvested * 1.15;
    return { totalInvested, currentValue };
  }, [investments]);

  if (loading) {
    return <div className="loading-fullscreen">Loading Investments...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <InvestmentForm onClose={() => setFormModalOpen(false)} />
      </Modal>

      <div className="investments-page-container">
        <div className="page-header">
          <div>
            <h1>Investments Dashboard</h1>
            <p>
              Track your portfolio's performance and watch your wealth grow.
            </p>
          </div>
          <button
            className="add-investment-btn"
            onClick={() => setFormModalOpen(true)}
          >
            + Add Investment
          </button>
        </div>

        <div className="page-section">
          <InvestmentOverview
            totalInvested={portfolioStats.totalInvested}
            currentValue={portfolioStats.currentValue}
          />
        </div>

        <div className="page-section">
          <InvestmentHoldingsList investments={investments} />
        </div>
      </div>
    </>
  );
};

export default InvestmentsPage;
