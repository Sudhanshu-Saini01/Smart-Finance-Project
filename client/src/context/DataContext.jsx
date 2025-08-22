// client/src/context/DataContext.jsx

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
  //-------- Start: Version V3.0.0---------//
  const [commitments, setCommitments] = useState([]); // New state for commitments
  //-------- End: Version V3.0.0---------//
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      //-------- Start: Version V3.0.0---------//
      // Added the new commitments API call
      const [
        userRes,
        summaryRes,
        transRes,
        goalsRes,
        loansRes,
        investmentsRes,
        commitmentsRes,
      ] = await Promise.all([
        axios.get("http://localhost:3001/api/users/profile"),
        axios.get("http://localhost:3001/api/transactions/monthly-summary"),
        axios.get("http://localhost:3001/api/transactions"),
        axios.get("http://localhost:3001/api/goals"),
        axios.get("http://localhost:3001/api/loans"),
        axios.get("http://localhost:3001/api/investments"),
        axios.get("http://localhost:3001/api/commitments"), // New API call
      ]);

      setUser(userRes.data);
      setSummary(summaryRes.data);
      setTransactions(transRes.data);
      setGoals(goalsRes.data);
      setLoans(loansRes.data);
      setInvestments(investmentsRes.data);
      setCommitments(commitmentsRes.data); // Set the new state
      setError("");
      //-------- End: Version V3.0.0---------//
    } catch (err) {
      console.error("Failed to fetch V3 data", err);
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
    //-------- Start: Version V3.0.0---------//
    commitments, // Provide commitments to the rest of the app
    //-------- End: Version V3.0.0---------//
    loading,
    error,
    refetchData: fetchData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
