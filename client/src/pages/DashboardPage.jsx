// client/src/pages/DashboardPage.jsx
// /----- VERSION V2 -----/

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import MonthlyStatusCard from "../components/MonthlyStatusCard";
import SummaryChart from "../components/SummaryChart";
import FinancialInsights from "../components/FinancialInsights";
import WelcomeKit from "../components/WelcomeKit"; // 1. Import the new component
import "../Dashboard.css";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  // 2. Get the transactions list from the DataContext
  const { summary, transactions, loading, error } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Dashboard...</div>;
  }

  // 3. The new "Welcome Kit" logic
  // If the user has no transactions, show the WelcomeKit instead of the dashboard.
  if (transactions && transactions.length === 0) {
    return (
      <div className="dashboard-container">
        <WelcomeKit user={user} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-greeting">
        <h2>Welcome back, {user?.name}!</h2>
        <p>
          Here is your financial summary for Haridwar, as of{" "}
          {new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "short",
          })}
          .
        </p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* The status cards are now persistent in App.jsx, so we remove them from here */}

      <div className="dashboard-section" style={{ marginBottom: "40px" }}>
        <FinancialInsights summary={summary} />
      </div>

      <div className="dashboard-section">
        <h3>Monthly Overview</h3>
        <SummaryChart data={summary} />
      </div>
    </div>
  );
};

export default DashboardPage;
// /----- END VERSION V2 -----/
