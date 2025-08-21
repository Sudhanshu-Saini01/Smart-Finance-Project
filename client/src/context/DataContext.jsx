// client/src/context/DataContext.jsx
//======= VERSION V2 =======//

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]); // NEW: Replaces wishlist and savings
  const [loans, setLoans] = useState([]); // NEW: For loan management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [summaryRes, transRes, goalsRes, loansRes] = await Promise.all([
        axios.get("http://localhost:3001/api/transactions/monthly-summary"),
        axios.get("http://localhost:3001/api/transactions"),
        axios.get("http://localhost:3001/api/goals"), // NEW API call
        axios.get("http://localhost:3001/api/loans"), // NEW API call
      ]);

      setSummary(summaryRes.data);
      setTransactions(transRes.data);
      setGoals(goalsRes.data);
      setLoans(loansRes.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Could not load financial data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const contextValue = {
    summary,
    transactions,
    goals,
    loans,
    loading,
    error,
    refetchData: fetchData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
