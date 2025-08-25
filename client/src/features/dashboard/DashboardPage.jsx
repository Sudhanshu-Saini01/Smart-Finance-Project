// client/src/features/dashboard/DashboardPage.jsx

// --- Core Imports ---
import React, { useContext } from "react";
import { DataContext } from "@/context/DataContext";
import { AuthContext } from "@/context/AuthContext";

// --- Component Imports ---
import SummaryChart from "./components/SummaryChart/SummaryChart";
import FinancialInsights from "./components/FinancialInsights/FinancialInsights";
import WelcomeKit from "./components/WelcomeKit/WelcomeKit";
import UpcomingPayments from "@/components/ui/UpcomingPayments/UpcomingPayments";

// --- Stylesheet Import ---
import "./Dashboard.css";

/**
 * @component DashboardPage
 * @desc      The main landing page for a logged-in user, displaying a comprehensive
 * overview of their financial situation.
 */
const DashboardPage = () => {
  // --- State & Context Access ---
  const { user } = useContext(AuthContext);
  // Get all financial data, including commitments and loans for the new component.
  const { summary, transactions, commitments, loans, loading, error } =
    useContext(DataContext);

  // --- Conditional Rendering: Loading State ---
  if (loading) {
    return <div className="loading-fullscreen">Loading Dashboard...</div>;
  }

  // --- Conditional Rendering: New User "Welcome Kit" ---
  if (transactions && transactions.length === 0) {
    return (
      <div className="dashboard-container">
        <WelcomeKit user={user} />
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-greeting">
        <h2>Welcome back, {user?.name}!</h2>
        <p>
          Here is your financial summary, as of{" "}
          {new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "short",
          })}
          .
        </p>
      </div>

      {/* Display an error message if data fetching failed. */}
      {error && <p className="error-message">{error}</p>}

      {/* Main Grid Layout for Dashboard Content */}
      <div className="dashboard-grid">
        <div className="grid-item-wide">
          <FinancialInsights summary={summary} />
        </div>
        <div className="grid-item">
          {/* We now pass the required data to our reusable UpcomingPayments component. */}
          <UpcomingPayments commitments={commitments} loans={loans} />
        </div>
        <div className="grid-item">
          <h3>Monthly Overview</h3>
          <SummaryChart data={summary} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
