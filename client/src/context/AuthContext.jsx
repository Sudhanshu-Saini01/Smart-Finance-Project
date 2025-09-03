// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useCallback } from "react";
import api from "@/utils/api"; // Use our central, configured API client

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Manages initial app load

  // This function is now responsible for loading the user from a token
  const loadUserFromToken = useCallback(async () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data); // Set the full user object, including their role
      } catch (err) {
        // If the token is invalid (e.g., expired), log the user out
        localStorage.removeItem("token", err);
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  // This effect runs only once when the app starts
  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  // The new login function is smarter. It sets the token AND fetches the user data.
  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    // After setting the token, immediately fetch the user's profile
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile after login", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Provide the full user object to the rest of the app
  const contextValue = { token, user, isLoading, login, logout };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Don't render children until the initial user load attempt is complete */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
