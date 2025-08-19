// client/src/context/AuthContext.jsx (NEW FILE)

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // If we have a token, set it in the axios default headers
      axios.defaults.headers.common["x-auth-token"] = token;
      // Fetch user data
      axios
        .get("http://localhost:3001/api/users/profile")
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch(() => {
          // If token is invalid, remove it
          logout();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["x-auth-token"];
  };

  // The value provided to the consuming components
  const contextValue = {
    token,
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
