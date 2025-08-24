// client/src/App.jsx

// --- Core & Library Imports ---
import React, { useContext } from "react";
import {
  BrowserRouter as Router, // The main router component that enables URL-based navigation.
  Routes, // A container for a collection of <Route> elements.
  Route, // Defines a mapping between a URL path and a component.
  Navigate, // A component to redirect the user to another route.
  // Note: useLocation is no longer needed here as the header is now consistent across all pages.
} from "react-router-dom";

// --- Context Imports ---
// These hooks allow components to access global state without prop drilling.
import { AuthContext } from "./context/AuthContext";
import { DataContext } from "./context/DataContext";

// --- Page & Component Imports ---
// Authentication Pages
import LoginPage from "@/features/authentication/LoginPage";
import SignupPage from "@/features/authentication/SignupPage";
// Main Application Pages
import DashboardPage from "./features/dashboard/DashboardPage";
import TransactionsPage from "@/features/transactions/TransactionsPage";
import GoalsPage from "@/features/goals/GoalsPage";
import SavingsAndInvestmentsPage from "@/features/savingsAndInvestments/SavingsAndInvestmentsPage";
import LoansPage from "@/features/loans/LoansPage";
// ===================================================================
// == UPDATE: 2025-08-23 | Add Income Page Route ==
// This new line imports our dedicated Income management page.
import IncomePage from "@/features/income/IncomePage";
// ===================================================================

// Shared Layout Components
import Navbar from "@/components/layout/Navbar/Navbar";
// Note: MonthlyStatusCard is no longer used in this component.
// import MonthlyStatusCard from "./features/dashboard/components/MonthlyStatusCard/MonthlyStatusCard";
import SummaryStrip from "./features/dashboard/components/SummaryStrip/SummaryStrip";
// ===================================================================
// == UPDATE: 2025-08-24 | Add Notification System ==
// This new line imports our visual Notification component.
import Notification from "@/components/ui/Notification/Notification";
// ===================================================================

// --- Stylesheet Import ---
import "@/styles/App.css";

/**
 * @component AppLayout
 * @desc      Defines the main layout for all authenticated pages.
 * It includes the main content area for different pages.
 */
const AppLayout = () => {
  return (
    <main className="main-content-area">
      <div className="page-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* =================================================================== */}
          {/* == UPDATE: 2025-08-23 | Add Income Page Route == */}
          {/* This new route maps the '/income' URL path to our new IncomePage component. */}
          <Route path="/income" element={<IncomePage />} />
          {/* =================================================================== */}
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/investments" element={<SavingsAndInvestmentsPage />} />
          <Route path="/loans" element={<LoansPage />} />
          {/* A catch-all route that redirects any unknown URL back to the dashboard. */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </main>
  );
};

/**
 * @component App
 * @desc      The root component that handles top-level routing.
 * It determines whether to show authentication pages or the main application layout.
 */
function App() {
  // Get the user's authentication token and loading status from the global context.
  const { token, isLoading: authLoading } = useContext(AuthContext);

  // Show a loading screen while the app is checking the user's login status.
  if (authLoading) {
    return <div className="loading-fullscreen">Initializing App...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {/* The Navbar is only shown if the user is logged in (i.e., a token exists). */}
        {token && <Navbar />}

        {/* =================================================================== */}
        {/* == UPDATE: 2025-08-24 | Add Notification System == */}
        {/* The Notification component is placed here so it can appear as an overlay */}
        {/* on top of any page in the application. */}
        <Notification />
        {/* =================================================================== */}

        {/* The Routes component manages which page to show based on the URL. */}
        <Routes>
          {/* Public Routes: Login and Signup */}
          {/* If the user is logged in, trying to access /login will redirect them to the dashboard. */}
          <Route
            path="/login"
            element={!token ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!token ? <SignupPage /> : <Navigate to="/" />}
          />

          {/* Private Routes: All other application pages */}
          {/* If the user is logged in, any other path will render the AppLayout. */}
          {/* If they are not logged in, it will redirect them to the login page. */}
          <Route
            path="/*"
            element={token ? <AppLayout /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
