// client/src/App.jsx

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppRoutes from "./AppRoutes"; // Our new routing component
import "@/styles/App.css";

function App() {
  return (
    // Wrap the entire application in all the necessary global providers
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <Router basename="/Smart-Finance-Project">
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
