// client/src/context/NotificationContext.jsx

import React, { createContext, useState, useCallback } from "react";

// --- Context Creation ---
const NotificationContext = createContext();

/**
 * @component NotificationProvider
 * @desc      This component manages the state and logic for a global "smart receipt" notification system.
 * @param {object} { children } - Represents any components nested inside.
 */
const NotificationProvider = ({ children }) => {
  // --- State Management ---
  // `notification` state now holds a more complex payload object.
  const [notification, setNotification] = useState(null);

  // --- Functions ---
  /**
   * @function showNotification
   * @desc     This is the main function that other components will call to trigger a notification.
   * It now accepts a single payload object with all the necessary information.
   * @param {object} payload - An object containing the notification details.
   * @param {string} payload.title - The main title of the notification (e.g., "Success!").
   * @param {string} payload.message - The user-friendly message (e.g., "Payment for 'Rent' processed.").
   * @param {object} [payload.details] - An optional object with developer-specific information.
   */
  const showNotification = useCallback((payload) => {
    // Set the notification state to make the pop-up appear.
    setNotification(payload);

    // Set a timer to automatically clear the notification after 5 seconds (5000 milliseconds).
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  // --- Context Value ---
  const contextValue = {
    notification,
    showNotification,
  };

  // --- Provider JSX ---
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// --- Exports ---
export { NotificationContext, NotificationProvider };
