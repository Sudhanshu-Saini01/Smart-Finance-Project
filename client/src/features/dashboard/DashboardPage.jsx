// client/src/pages/DashboardPage.jsx

// --- Core Imports ---
import React, { useContext } from "react";
// We import the contexts to access global state for both data and authentication.
import { DataContext } from "../../context/DataContext";
import { AuthContext } from "../../context/AuthContext";
// ===================================================================
// == UPDATE: 2025-08-24 | Add Notification Test Button ==
// We import the NotificationContext to trigger a test notification.
import { NotificationContext } from "../../context/NotificationContext";
// ===================================================================

// --- Component Imports ---
// These are the building blocks that make up the dashboard UI.
import MonthlyStatusCard from "./components/MonthlyStatusCard/MonthlyStatusCard";
import SummaryChart from "./components/SummaryChart/SummaryChart";
import FinancialInsights from "./components/FinancialInsights/FinancialInsights";
import WelcomeKit from "./components/WelcomeKit/WelcomeKit"; // A special component for new users.

// --- Stylesheet Import ---
import "./Dashboard.css";

/**
 * @component DashboardPage
 * @desc      The main landing page for a logged-in user, displaying a comprehensive
 * overview of their financial situation.
 */
const DashboardPage = () => {
  // --- State & Context Access ---
  // Pulling the user's profile from the AuthContext.
  const { user } = useContext(AuthContext);
  // Pulling all financial data and loading status from the DataContext.
  const { summary, transactions, loading, error } = useContext(DataContext);

  // ===================================================================
  // == UPDATE: 2025-08-24 | Add Notification Test Button ==
  // We get the showNotification function from its context.
  const { showNotification } = useContext(NotificationContext);
  // ===================================================================

  // --- Conditional Rendering: Loading State ---
  // If the data is still being fetched from the server, display a loading message.
  // This prevents the user from seeing an empty or broken page on initial load.
  if (loading) {
    return <div className="loading-fullscreen">Loading Dashboard...</div>;
  }

  // --- Conditional Rendering: New User "Welcome Kit" ---
  // This is a feature to improve the experience for brand new users.
  // If a user has an account but has not added any transactions yet,
  // we show them the WelcomeKit component instead of the standard dashboard.
  if (transactions && transactions.length === 0) {
    return (
      <div className="dashboard-container">
        <WelcomeKit user={user} />
      </div>
    );
  }

  // --- Main Dashboard View ---
  // This is the standard view for a user who has financial data.
  return (
    <div className="dashboard-container">
      {/* =================================================================== */}
      {/* == UPDATE: 2025-08-24 | Add Notification Test Button == */}
      {/* This is a temporary button for debugging. Clicking it should trigger the notification. */}
      <button
        onClick={() =>
          showNotification({
            title: "Test Success!",
            message: "The notification system is working.",
          })
        }
        style={{
          padding: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "2rem",
        }}
      >
        Test Notification
      </button>
      {/* =================================================================== */}

      <div className="dashboard-greeting">
        {/* A personalized welcome message using the user's name. */}
        <h2>Welcome back, {user?.name}!</h2>
        <p>
          {/* The date and time are dynamically generated and formatted for the Indian timezone. */}
          Here is your financial summary, as of{" "}
          {new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "short",
          })}
          .
        </p>
        {/* // Note: This block of code is now redundant and can be removed. // In
        our updated `App.jsx`, the `AppLayout` component is now responsible for
        displaying // a persistent header (either the MonthlyStatusCards or the
        SummaryStrip). // Keeping this code here would cause the status cards to
        be displayed twice on the dashboard. // It is commented out to maintain
        a single source of truth for the page layout. */}
        <div className="persistent-status-cards">
          <MonthlyStatusCard
            data={summary?.currentMonth}
            user={user}
            className="current-month-card"
          />
          <MonthlyStatusCard
            data={summary?.previousMonth}
            user={user}
            className="previous-month-card"
          />
        </div>
      </div>

      {/* If an error occurred while fetching data, display an error message to the user. */}
      {error && <p className="error-message">{error}</p>}

      {/* The main content sections of the dashboard. */}
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
