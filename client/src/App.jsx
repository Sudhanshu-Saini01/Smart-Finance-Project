// client/src/App.jsx

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
//-------- Start: Version V3.0.0---------//
import SummaryStrip from "./components/SummaryStrip"; // Import the new component
//-------- End: Version V3.0.0---------//
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const { user, summary, loading: dataLoading } = useContext(DataContext);
  const location = useLocation();
  const isDashboard = location.pathname === "/";

  return (
    <main className="main-content-area">
      {!dataLoading && (
        //-------- Start: Version V3.0.0---------//
        <div className="persistent-header">
          {isDashboard ? (
            <div className="status-cards-container two-card-layout">
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
          ) : (
            <SummaryStrip data={summary?.currentMonth} />
          )}
        </div>
        //-------- End: Version V3.0.0---------//
      )}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/investments" element={<SavingsAndInvestmentsPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </main>
  );
};

function App() {
  const { token, isLoading: authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <div className="loading-fullscreen">Initializing App...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {token && <Navbar />}
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
            path="/*"
            element={token ? <AppLayout /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
