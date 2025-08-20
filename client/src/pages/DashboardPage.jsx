// // client/src/pages/DashboardPage.jsx (CORRECTED)

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import TransactionForm from "../components/TransactionForm";
// import MonthlyStatusCard from "../components/MonthlyStatusCard";
// import "../Dashboard.css"; // This import is crucial!

// const DashboardPage = () => {
//   const { user } = useContext(AuthContext);
//   const [summaryData, setSummaryData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3001/api/transactions/monthly-summary"
//       );
//       setSummaryData(res.data);
//     } catch (err) {
//       setError("Failed to fetch dashboard data.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="loading-fullscreen">Loading Dashboard...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-greeting">
//         <h2>Welcome back, {user?.email}!</h2>
//         <p>Here is your financial summary.</p>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <div className="status-cards-container">
//         <MonthlyStatusCard data={summaryData?.currentMonth} />
//         <MonthlyStatusCard data={summaryData?.previousMonth} />
//       </div>

//       <main className="dashboard-main-single-column">
//         <div className="dashboard-section">
//           <h2>Add New Transaction</h2>
//           <TransactionForm onTransactionAdded={fetchData} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;

// client/src/pages/DashboardPage.jsx (REFURBISHED 20-08-2025)

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext"; // 1. Import the DataContext
import { AuthContext } from "../context/AuthContext";
import TransactionForm from "../components/TransactionForm";
import MonthlyStatusCard from "../components/MonthlyStatusCard";
import SummaryChart from "../components/SummaryChart"; // 1. Import the new chart component
import FinancialInsights from "../components/FinancialInsights"; // 1. Import the new component
import "../Dashboard.css";

const DashboardPage = () => {
  // 2. Get data and functions from our two central contexts
  const { user } = useContext(AuthContext);
  const { summary, loading, error, refetchData } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-greeting">
        <h2>Welcome back, {user?.email}!</h2>
        <p>
          Here is your financial summary for Haridwar, as of{" "}
          {new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}
          .
        </p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="status-cards-container">
        <MonthlyStatusCard data={summary?.currentMonth} />
        <MonthlyStatusCard data={summary?.previousMonth} />
      </div>

      <div className="dashboard-section" style={{ marginBottom: "40px" }}>
        <FinancialInsights summary={summary} />
      </div>

      <div className="dashboard-section">
        <h3>Monthly Overview</h3>
        <SummaryChart data={summary} />
      </div>

      <main className="dashboard-main-single-column">
        <div className="dashboard-section">
          <h2>Add New Transaction</h2>
          {/* 3. Pass the refetchData function to the form */}
          <TransactionForm onTransactionAdded={refetchData} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
