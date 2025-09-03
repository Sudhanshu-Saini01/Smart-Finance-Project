// client/src/features/savingsAndInvestments/SavingsAndInvestmentsPage.jsx

import React, { useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "@/context/DataContext";
import ExpensesBlueprint from "@/features/dashboard/components/ExpensesBlueprint/ExpensesBlueprint";
import SavingsInvestmentsForm from "@/features/savingsAndInvestments/components/SavingsInvestmentsForm";
// --- FIX: Correct import path for the reusable component ---
import UpcomingPayments from "@/components/ui/UpcomingPayments/UpcomingPayments";
import PortfolioItem from "@/features/savingsAndInvestments/components/PortfolioItem";
import "./SavingsAndInvestmentsPage.css";

const SavingsAndInvestmentsPage = () => {
  // --- FIX: Destructure 'loans' from context as well ---
  const { recurrings, loans, summary, loading } = useContext(DataContext);

  const location = useLocation();
  const prefilledGoal = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const goalId = params.get("goalId");
    const goalName = params.get("goalName");
    if (goalId && goalName) {
      return { id: goalId, name: goalName };
    }
    return null;
  }, [location.search]);

  if (loading) {
    return <div className="loading-fullscreen">Loading Data...</div>;
  }

  const portfolioItems = recurrings.filter(
    (c) => c.recurringType === "savings" || c.recurringType === "investment"
  );

  return (
    <div className="si-page-container">
      <h1>Savings & Investments</h1>

      <div className="si-section">
        <h3>Your Monthly Blueprint</h3>
        <ExpensesBlueprint recurrings={recurrings} summary={summary} />
      </div>

      <div className="si-section">
        <SavingsInvestmentsForm prefilledGoal={prefilledGoal} />
      </div>

      <div className="si-section">
        <h3>Upcoming Payments</h3>
        {/* --- FIX: Pass 'recurrings' and 'loans' as props --- */}
        <UpcomingPayments recurrings={recurrings} loans={loans} />
      </div>

      <div className="si-section">
        <h3>Your Portfolio</h3>
        <div className="portfolio-grid">
          {portfolioItems.length > 0 ? (
            portfolioItems.map((item) => (
              <PortfolioItem key={item._id} item={item} />
            ))
          ) : (
            <div className="empty-state">
              <p>You have no savings or investment recurrings set up.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsAndInvestmentsPage;
