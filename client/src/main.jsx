// client/src/main.jsx

// --- Core Imports ---
// These lines import the necessary libraries to build and render the React application.
import React from "react";
import ReactDOM from "react-dom/client";

// --- App Structure Imports ---
// This imports the main App component, which is the top-level container for our UI.
import App from "./App.jsx";
// These import "Context Providers", which are special components that share global data
// with all other components nested inside them.
import { AuthProvider } from "./context/AuthContext"; // Manages user login status.
import { DataProvider } from "./context/DataContext.jsx"; // Manages financial data.

// ===================================================================
// == UPDATE: 2025-08-24 | Add Notification System ==
// This new line imports our NotificationProvider, which manages the state
// for our global pop-up notification system.
import { NotificationProvider } from "./context/NotificationContext.jsx";
// ===================================================================

// --- Application Mount ---
// This is the starting point that connects our React app to the web page.
// It finds the HTML element with the ID 'root' and renders our components inside it.
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode is a developer tool that highlights potential problems in the app.
  // It doesn't affect the final production version.
  <React.StrictMode>
    {/*
      By wrapping our App in these providers, we ensure that any component
      can access authentication info (from AuthProvider) or financial data
      (from DataProvider) without needing to pass props down manually.
    */}
    <AuthProvider>
      <DataProvider>
        {/* =================================================================== */}
        {/* == UPDATE: 2025-08-24 | Add Notification System == */}
        <NotificationProvider>
          <App />
        </NotificationProvider>
        {/* =================================================================== */}
        {/* <App /> */}
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
