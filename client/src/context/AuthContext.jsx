// client/src/context/AuthContext.jsx

// --- Core Imports ---
// These lines import the necessary tools from React to create and manage global state.
import React, { createContext, useState, useEffect } from "react";
// Axios is a library used to make HTTP requests to your backend server (e.g., to log in or fetch user data).
import axios from "axios";

// --- Context Creation ---
// This creates the "AuthContext" object. It's like a container that will hold our global authentication state.
const AuthContext = createContext();

/**
 * @component AuthProvider
 * @desc      This is a special component that "provides" the authentication state
 * and functions to all other components wrapped inside it.
 * @param {object} { children } - Represents any components that are nested inside the provider.
 */
const AuthProvider = ({ children }) => {
  // --- State Management ---
  // This state holds the user's authentication token. It's initialized from `localStorage`,
  // which allows the user to stay logged in even after closing the browser tab.
  const [token, setToken] = useState(localStorage.getItem("token"));

  // This state will hold the logged-in user's profile information (e.g., name, email).
  const [user, setUser] = useState(null);

  // This state tracks whether the initial authentication check is complete.
  // It's used to show a loading screen when the app first starts.
  const [isLoading, setIsLoading] = useState(true);

  // --- Effects ---
  // This `useEffect` hook runs automatically whenever the `token` state changes.
  // Its main job is to validate the token and fetch the user's profile.
  useEffect(() => {
    // If a token exists, we assume the user might be logged in.
    if (token) {
      // Automatically add the token to the headers of all future API requests made with Axios.
      // This ensures that every request to the server is authenticated.
      axios.defaults.headers.common["x-auth-token"] = token;

      // Make an API call to the server to get the user's profile data.
      axios
        .get("http://localhost:3001/api/users/profile")
        .then((response) => {
          // If the request is successful, store the user's data in the state.
          setUser(response.data);
          // Mark the initial loading as complete.
          setIsLoading(false);
        })
        .catch(() => {
          // If the request fails (e.g., the token is expired or invalid),
          // log the user out completely.
          logout();
          setIsLoading(false);
        });
    } else {
      // If there's no token, we know the user is not logged in.
      // We can immediately mark the loading as complete.
      setIsLoading(false);
    }
  }, [token]); // The dependency array `[token]` means this effect will re-run only when the token changes.

  // --- Authentication Functions ---

  /**
   * @function login
   * @desc     Saves the user's token to localStorage and updates the state,
   * triggering the `useEffect` to fetch user data.
   * @param {string} newToken - The JWT received from the server after a successful login.
   */
  const login = (newToken) => {
    // Store the token in the browser's local storage for persistence.
    localStorage.setItem("token", newToken);
    // Update the `token` state, which will cause the component to re-render and the `useEffect` to run.
    setToken(newToken);
  };

  /**
   * @function logout
   * @desc     Clears all authentication data from the app and local storage.
   */
  const logout = () => {
    // Remove the token from local storage.
    localStorage.removeItem("token");
    // Clear the token and user from the component's state.
    setToken(null);
    setUser(null);
    // Remove the token from the default Axios headers to prevent sending an invalid token on future requests.
    delete axios.defaults.headers.common["x-auth-token"];
  };

  // --- Context Value ---
  // This object bundles up all the state and functions that we want to make available to other components.
  const contextValue = {
    token,
    user,
    isLoading,
    login,
    logout,
  };

  // --- Provider JSX ---
  // This renders the actual Provider component. Any child components will be able to
  // access the `contextValue` object using the `useContext` hook.
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// --- Exports ---
// We export both the context object itself and the provider component.
export { AuthContext, AuthProvider };
