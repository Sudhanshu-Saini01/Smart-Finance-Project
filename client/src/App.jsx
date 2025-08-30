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

// --- NEW: Import our new PublicLayout ---
import PublicLayout from "@/components/layout/PublicLayout/PublicLayout";

// --- Page & Component Imports ---
import LandingPage from "@/features/landing/LandingPage";
import FeatureDetailPage from "@/features/feature-details/FeatureDetailPage";

// Authentication Pages
import LoginPage from "@/features/authentication/LoginPage";
import SignupPage from "@/features/authentication/SignupPage";
// Main Application Pages
import DashboardPage from "./features/dashboard/DashboardPage";
import TransactionsPage from "@/features/transactions/TransactionsPage";
import GoalsPage from "@/features/goals/GoalsPage";
import SavingsAndInvestmentsPage from "@/features/savingsAndInvestments/SavingsAndInvestmentsPage";
import InvestmentsPage from "@/features/investments/InvestmentsPage";
import SavingsPage from "@/features/savings/SavingsPage";
import InsurancePage from "@/features/insurance/InsurancePage";
import LoansPage from "@/features/loans/LoansPage";
import IncomePage from "@/features/income/IncomePage";
import FixedExpensesPage from "@/features/expenses/FixedExpensesPage";
import VariableExpensesPage from '@/features/expenses/VariableExpensesPage';


// import AppLayout from "./AppLayout";

// Shared Layout Components
import Navbar from "@/components/layout/Navbar/Navbar";
import Notification from "@/components/ui/Notification/Notification";

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
          <Route path="/income" element={<IncomePage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          {/* <Route path="/investments" element={<SavingsAndInvestmentsPage />} /> */}
          <Route path="/investments" element={<InvestmentsPage />} />
          <Route path="/savings" element={<SavingsPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/fixedExpenses" element={<FixedExpensesPage />} />
          <Route path="/variableExpenses" element={<VariableExpensesPage />} />
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

        <Notification />

        {/* The Routes component manages which page to show based on the URL. */}
        {/* <Routes> */}
        {/* Public Routes: Login and Signup */}
        {/* If the user is logged in, trying to access /login will redirect them to the dashboard. */}
        {/* <Route
            path="/login"
            element={!token ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!token ? <SignupPage /> : <Navigate to="/" />}
          /> */}

        {/* Private Routes: All other application pages */}
        {/* If the user is logged in, any other path will render the AppLayout. */}
        {/* If they are not logged in, it will redirect them to the login page. */}
        {/* <Route
            path="/*"
            element={token ? <AppLayout /> : <Navigate to="/login" />}
          />
        </Routes> */}

        <Routes>
          {token ? (
            // --- PRIVATE ROUTES (User is Logged In) ---
            <Route path="/*" element={<AppLayout />} />
          ) : (
            // --- PUBLIC ROUTES (User is a Visitor) ---
            // <Routes>
            // All public routes are now children of the PublicLayout route.
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* --- NEW DYNAMIC ROUTE --- */}
              {/* This one route will handle /features/dashboard, /features/spending, etc. */}
              <Route
                path="/features/:featureName"
                element={<FeatureDetailPage />}
              />
              <Route path="*" element={<Navigate to="/" />} />
              {/* If a visitor goes to any other path, redirect them to the landing page */}
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
