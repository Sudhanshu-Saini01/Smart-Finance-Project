// client/src/context/DataContext.jsx

// --- Core Imports ---
import React, { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
import api from "@/utils/api";
import { AuthContext } from "./AuthContext";

// --- Context Creation ---
// This creates the "DataContext" object, which will hold all the global financial data.
const DataContext = createContext();

/**
 * @component DataProvider
 * @desc      This component fetches and manages all application-wide financial data
 * once the user is authenticated.
 * @param {object} { children } - Represents any components nested inside.
 */
const DataProvider = ({ children }) => {
  // --- State Hooks ---
  // Access the authentication token from the AuthContext.
  const { token } = useContext(AuthContext);

  // State for each type of data we need to manage across the app.
  const [user, setUser] = useState(null); // Holds the logged-in user's profile.
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loans, setLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);

  const [loading, setLoading] = useState(true); // Tracks if the initial data fetch is in progress.
  const [error, setError] = useState(""); // Stores any errors that occur during data fetching.

  /**
   * @function fetchData
   * @desc     An asynchronous function that fetches all necessary financial data from the backend API.
   * It is designed to be called once the user is confirmed to be logged in.
   */
  const fetchData = async () => {
    // If there's no token, we can't fetch data, so we stop here.
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true); // Set loading to true before starting the API calls.
    try {
      // `Promise.all` is a powerful feature that allows us to make multiple API calls concurrently (at the same time).
      // This is much faster than making them one by one.
      const [
        userRes,
        summaryRes,
        transRes,
        goalsRes,
        loansRes,
        investmentsRes,
        commitmentsRes,
        incomeSourcesRes,
      ] = await Promise.all([
        api.get("http://localhost:3001/api/users/profile"),
        api.get("http://localhost:3001/api/transactions/monthly-summary"),
        api.get("http://localhost:3001/api/transactions"),
        api.get("http://localhost:3001/api/goals"),
        api.get("http://localhost:3001/api/loans"),
        api.get("http://localhost:3001/api/investments"),
        api.get("http://localhost:3001/api/commitments"),
        api.get("http://localhost:3001/api/income-sources"),
      ]);

      // Once all requests are successful, we update our state with the data from the responses.
      setUser(userRes.data);
      setSummary(summaryRes.data);
      setTransactions(transRes.data);
      setGoals(goalsRes.data);
      setLoans(loansRes.data);
      setInvestments(investmentsRes.data);
      setCommitments(commitmentsRes.data);
      setIncomeSources(incomeSourcesRes.data);

      setError(""); // Clear any previous errors.
    } catch (err) {
      // If any of the API calls in Promise.all fail, this block will run.
      console.error("Failed to fetch data", err);
      setError("Could not load financial data.");
    } finally {
      // The `finally` block runs regardless of whether the `try` or `catch` block executed.
      // This is the perfect place to set loading to false.
      setLoading(false);
    }
  };

  // --- Effects ---
  // This `useEffect` hook runs when the component first mounts and whenever the `token` changes.
  useEffect(() => {
    // We only call `fetchData` if a token is present.
    if (token) {
      fetchData();
    }
  }, [token]); // The dependency array `[token]` ensures this effect re-runs if the user logs in or out.

  // --- Context Value ---
  // This object bundles up all the data and functions to be provided to other components.
  const contextValue = {
    user,
    summary,
    transactions,
    goals,
    loans,
    investments,
    commitments,
    incomeSources,
    loading,
    error,
    // We also provide the `fetchData` function itself. This allows any component
    // to trigger a full data refresh (e.g., after adding a new transaction).
    refetchData: fetchData,
  };

  // --- Provider JSX ---
  // Renders the provider, making the `contextValue` available to all child components.
  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// --- Exports ---
export { DataContext, DataProvider };
