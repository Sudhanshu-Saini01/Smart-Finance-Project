// client/src/pages/DashboardPage.jsx (FINAL POLISHED VERSION)

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import MonthlyStatusCard from "../components/MonthlyStatusCard";
import SummaryChart from "../components/SummaryChart";
import FinancialInsights from "../components/FinancialInsights";
import "../Dashboard.css";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { summary, loading, error } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Dashboard...</div>;
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

      <div className="status-cards-container">
        {/* Pass down the new class names */}
        <MonthlyStatusCard
          data={summary?.currentMonth}
          className="current-month-card"
        />
        <MonthlyStatusCard
          data={summary?.previousMonth}
          className="previous-month-card"
        />
      </div>

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
