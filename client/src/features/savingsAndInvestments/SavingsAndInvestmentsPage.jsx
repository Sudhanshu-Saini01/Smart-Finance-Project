// client/src/pages/SavingsAndInvestmentsPage.jsx

// import React, { useContext, useState } from "react";
// ===================================================================
// == UPDATE: 2025-08-24 | Link Goals to Commitments ==
// We now need `useLocation` to read the query parameters from the URL.
import React, { useContext, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
// ===================================================================
import { DataContext } from "@/context/DataContext";
import ExpensesBlueprint from "@/features/dashboard/components/ExpensesBlueprint/ExpensesBlueprint";
import SavingsInvestmentsForm from "@/features/savingsAndInvestments/components/SavingsInvestmentsForm";
import UpcomingPayments from "@/features/dashboard/components/UpcomingPayments/UpcomingPayments";
// import UpcomingPayments from "@/features/transactions/components/UpcomingPayments/UpcomingPayments";
import PortfolioItem from "@/features/savingsAndInvestments/components/PortfolioItem";
import "./SavingsAndInvestmentsPage.css";

/**
 * @component SavingsAndInvestmentsPage
 * @desc      A page for managing all recurring financial commitments.
 */
const SavingsAndInvestmentsPage = () => {
  const { commitments, summary, loading } = useContext(DataContext);
  // We use today's date for the upcoming payments component.
  const [currentDate] = useState(new Date().toISOString().split("T")[0]);

  // ===================================================================
  // == UPDATE: 2025-08-24 | Link Goals to Commitments ==
  // This block of code reads the `goalId` and `goalName` from the URL.
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
  // ===================================================================

  if (loading) {
    return <div className="loading-fullscreen">Loading Data...</div>;
  }

  // Filter commitments to only show savings and investments in the portfolio.
  const portfolioItems = commitments.filter(
    (c) => c.commitmentType === "savings" || c.commitmentType === "investment"
  );

  return (
    <div className="si-page-container">
      <h1>Savings & Investments</h1>

      <div className="si-section">
        <h3>Your Monthly Blueprint</h3>
        <ExpensesBlueprint commitments={commitments} summary={summary} />
      </div>

      {/* <div className="si-section">
        <SavingsInvestmentsForm />
      </div> */}
      <div className="si-section">
        {/* =================================================================== */}
        {/* == UPDATE: 2025-08-24 | Link Goals to Commitments == */}
        {/* We now pass the pre-filled goal information as a prop to the form. */}
        <SavingsInvestmentsForm prefilledGoal={prefilledGoal} />
        {/* =================================================================== */}
      </div>

      <div className="si-section">
        <h3>Upcoming Payments</h3>
        <UpcomingPayments simulatedDate={currentDate} />
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
              <p>You have no savings or investment commitments set up.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsAndInvestmentsPage;
