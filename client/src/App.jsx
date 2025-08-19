// client/src/App.jsx (MAJOR UPDATE)

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardPage from "./pages/DashboardPage"; // Note the new path
import TransactionsPage from "./pages/TransactionsPage";
import WishlistPage from "./pages/WishlistPage";
import SavingsPage from "./pages/SavingsPage";
import Navbar from "./components/Navbar";
import "./App.css";

// A special component to protect routes that require a login
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const { token, isLoading } = useContext(AuthContext);
  // const [showLogin, setShowLogin] = React.useState(true);

  if (isLoading) {
    return <div className="loading-fullscreen">Loading...</div>;
  }

  return (
    <Router>
      {token && <Navbar />} {/* Show Navbar only when logged in */}
      <div className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!token ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!token ? <SignupPage /> : <Navigate to="/" />}
          />

          {/* Private Routes */}
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
            path="/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/savings"
            element={
              <PrivateRoute>
                <SavingsPage />
              </PrivateRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
