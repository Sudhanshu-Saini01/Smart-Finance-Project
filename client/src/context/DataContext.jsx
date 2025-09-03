// client/src/context/DataContext.jsx

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import api from "@/utils/api";
import { AuthContext } from "./AuthContext";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  // State for all our application data
  const [user, setUser] = useState(null);
  // const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loans, setLoans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [recurrings, setRecurrings] = useState([]);
  const [incomeSources, setIncomeSources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- THE REFACTORED FETCH FUNCTION ---
  // We wrap fetchData in useCallback. This is a React hook that ensures the function
  // itself doesn't get needlessly recreated on every render, which is a performance best practice.
  const fetchData = useCallback(async () => {
    // If there's no token, we can't fetch data.
    if (!token) {
      setLoading(false);
      return;
    }

    // setLoading(true);
    try {
      // Use shorter, relative paths. Our 'api' client handles the base URL.
      const [
        userRes,
        // summaryRes,
        transRes,
        goalsRes,
        loansRes,
        investmentsRes,
        recurringsRes,
        incomeSourcesRes,
      ] = await Promise.all([
        api.get("/users/profile"),
        // api.get("/transactions/monthly-summary"),
        api.get("/transactions"),
        api.get("/goals"),
        api.get("/loans"),
        api.get("/investments"),
        api.get("/recurrings"),
        api.get("/income-sources"),
      ]);

      // Set all the state with the data from the API responses
      setUser(userRes.data);
      // setSummary(summaryRes.data);
      setTransactions(transRes.data);
      setGoals(goalsRes.data);
      setLoans(loansRes.data);
      setInvestments(investmentsRes.data);
      setRecurrings(recurringsRes.data);
      setIncomeSources(incomeSourcesRes.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Could not load financial data.");
    } finally {
      setLoading(false);
    }
  }, [token]); // The function will only be recreated if the token changes.

  // This useEffect now runs when the component first mounts and whenever the token changes.
  // It calls our new, stable fetchData function.
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const contextValue = {
    user,
    // summary,
    transactions,
    goals,
    loans,
    investments,
    recurrings,
    incomeSources,
    loading,
    error,
    // We now export the stable 'fetchData' function as 'refetchData'.
    // When any component calls this, it will trigger a full, reliable data refresh.
    refetchData: fetchData,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
