// client/src/context/DataContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

// 1. Create the context
const DataContext = createContext();

// 2. Create the provider component
const DataProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    // Don't fetch if the user isn't logged in
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch all financial data in parallel for efficiency
      const [summaryRes, transRes, wishlistRes, goalsRes] = await Promise.all([
        axios.get("http://localhost:3001/api/transactions/monthly-summary"),
        axios.get("http://localhost:3001/api/transactions"),
        axios.get("http://localhost:3001/api/wishlist"),
        axios.get("http://localhost:3001/api/savings"),
      ]);

      setSummary(summaryRes.data);
      setTransactions(transRes.data);
      setWishlist(wishlistRes.data);
      setGoals(goalsRes.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Could not load financial data.");
    } finally {
      setLoading(false);
    }
  };

  // This useEffect will run once when the user logs in (when the token appears)
  useEffect(() => {
    fetchData();
  }, [token]);

  // The value provided to all consuming components
  const contextValue = {
    summary,
    transactions,
    wishlist,
    goals,
    loading,
    error,
    refetchData: fetchData, // Provide the function to refetch all data
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
