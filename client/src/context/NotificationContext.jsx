// client/src/context/NotificationContext.jsx
import React, { createContext, useState, useCallback } from "react";

const NotificationContext = createContext();

let id = 1;

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a new notification
  const addNotification = useCallback((message, type = "success") => {
    const newNotification = { id: id++, message, type };
    setNotifications((prev) => [...prev, newNotification]);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  }, []);

  // Function to remove a notification
  const removeNotification = useCallback((idToRemove) => {
    setNotifications((prev) => prev.filter((n) => n.id !== idToRemove));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
