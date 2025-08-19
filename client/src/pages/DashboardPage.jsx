// client/src/pages/DashboardPage.jsx (CORRECTED)

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";
import MonthlyStatusCard from "../components/MonthlyStatusCard";
import "../Dashboard.css"; // This import is crucial!

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/transactions/monthly-summary"
      );
      setSummaryData(res.data);
    } catch (err) {
      setError("Failed to fetch dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-fullscreen">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-greeting">
        <h2>Welcome back, {user?.email}!</h2>
        <p>Here is your financial summary.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="status-cards-container">
        <MonthlyStatusCard data={summaryData?.currentMonth} />
        <MonthlyStatusCard data={summaryData?.previousMonth} />
      </div>

      <main className="dashboard-main-single-column">
        <div className="dashboard-section">
          <h2>Add New Transaction</h2>
          <TransactionForm onTransactionAdded={fetchData} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
