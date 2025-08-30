// client/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // --- THIS IS THE FIX ---
      // OLD WAY: axios.defaults.headers.common["x-auth-token"] = token;
      // NEW WAY: We are now setting the 'Authorization' header in the "Bearer <token>" format.
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // --- END OF FIX ---

      axios
        .get("http://localhost:3001/api/users/profile")
        .then((response) => {
          setUser(response.data);
          setIsLoading(false);
        })
        .catch(() => {
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
    // --- IMPORTANT: Also delete the new Authorization header on logout ---
    delete axios.defaults.headers.common["Authorization"];
  };

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
