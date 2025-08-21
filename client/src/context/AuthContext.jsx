// client/src/context/AuthContext.jsx (FINAL, ROBUST VERSION)

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// /----- VERSION 2.2: Global Error Handling -----/
// This function sets up the "global security guard" (interceptor)
const setupAxiosInterceptors = (logoutHandler) => {
  axios.interceptors.response.use(
    // If the response is successful, just return it
    (response) => response,
    // If there's an error...
    (error) => {
      // Check if the error is a 401 Unauthorized
      if (error.response && error.response.status === 401) {
        // If it is, call the logout function
        logoutHandler();
      }
      // Return the error to be handled by the component that made the call
      return Promise.reject(error);
    }
  );
};
// /----- END VERSION 2.2 -----/

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    delete axios.defaults.headers.common["x-auth-token"];
  };

  useEffect(() => {
    // Set up the interceptor when the app loads
    setupAxiosInterceptors(logout);

    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
    setIsLoading(false);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const contextValue = {
    token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
