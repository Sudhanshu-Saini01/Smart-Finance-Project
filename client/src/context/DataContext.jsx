// client/src/context/DataContext.jsx
// /----- VERSION V2 -----/

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loans, setLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // This now fetches all V2 data in one go
      const [
        userRes,
        summaryRes,
        transRes,
        goalsRes,
        loansRes,
        investmentsRes,
      ] = await Promise.all([
        axios.get("http://localhost:3001/api/users/profile"),
        axios.get("http://localhost:3001/api/transactions/monthly-summary"),
        axios.get("http://localhost:3001/api/transactions"),
        axios.get("http://localhost:3001/api/goals"),
        axios.get("http://localhost:3001/api/loans"),
        axios.get("http://localhost:3001/api/investments"),
      ]);

      setUser(userRes.data);
      setSummary(summaryRes.data);
      setTransactions(transRes.data);
      setGoals(goalsRes.data);
      setLoans(loansRes.data);
      setInvestments(investmentsRes.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch V2 data", err);
      setError("Could not load financial data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const contextValue = {
    user,
    summary,
    transactions,
    goals,
    loans,
    investments,
    loading,
    error,
    refetchData: fetchData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
// /----- END VERSION V2 -----/
