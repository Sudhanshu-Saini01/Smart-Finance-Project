// client/src/App.jsx
// /----- VERSION V2 -----/

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { DataContext } from "./context/DataContext";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import GoalsPage from "./pages/GoalsPage";
import SavingsAndInvestmentsPage from "./pages/SavingsAndInvestmentsPage";
import LoansPage from "./pages/LoansPage";
import Navbar from "./components/Navbar";
import MonthlyStatusCard from "./components/MonthlyStatusCard";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token, isLoading: authLoading } = useContext(AuthContext);
  const { user, summary, loading: dataLoading } = useContext(DataContext);

  if (authLoading || (token && dataLoading)) {
    return <div className="loading-fullscreen">Loading Your Financials...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {token && <Navbar />}
        <main className="main-content-area">
          {token && (
            <div className="persistent-status-cards">
              <MonthlyStatusCard
                data={summary?.currentMonth}
                user={user}
                className="current-month-card"
              />
            </div>
          )}
          <div className="page-content">
            <Routes>
              <Route
                path="/login"
                element={!token ? <LoginPage /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!token ? <SignupPage /> : <Navigate to="/" />}
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <PrivateRoute>
                    <TransactionsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <PrivateRoute>
                    <GoalsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/investments"
                element={
                  <PrivateRoute>
                    <SavingsAndInvestmentsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/loans"
                element={
                  <PrivateRoute>
                    <LoansPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to={token ? "/" : "/login"} />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
// /----- END VERSION V2 -----/
