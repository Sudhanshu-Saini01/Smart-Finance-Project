// client/src/components/ui/Notification/Notification.jsx

import React, { useContext, useState, useEffect } from "react";
import { NotificationContext } from "@/context/NotificationContext";
import "./Notification.css";

/**
 * @component Notification
 * @desc      A UI component that displays global notifications as a pop-up toast.
 * It includes a toggleable "developer view" for debugging.
 */
const Notification = () => {
  // --- Context & State ---
  // Access the global notification state.
  const { notification } = useContext(NotificationContext);
  // This state controls the visibility of the developer details section.
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  // This flag controls whether the developer view is enabled.
  // You can set this to `false` in production to hide the details button completely.
  const isDeveloperMode = true;

  // --- Effects ---
  // This effect resets the details view whenever a new notification appears.
  useEffect(() => {
    setIsDetailsVisible(false);
  }, [notification]);

  // If there is no active notification, the component renders nothing.
  if (!notification) {
    return null;
  }

  // --- JSX Render ---
  return (
    <div className="notification-container">
      {/* The main toast element. Its class changes based on the notification type ('success' or 'error'). */}
      <div className={`notification-toast ${notification.type || "success"}`}>
        <div className="notification-content">
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
        </div>

        {/* The developer details section is only rendered if details exist and developer mode is on. */}
        {isDeveloperMode && notification.details && (
          <div className="developer-details">
            <button
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
              className="details-toggle"
            >
              {isDetailsVisible ? "Hide" : "View"} Developer Details
            </button>
            {/* The details are only shown if the user has clicked the toggle button. */}
            {isDetailsVisible && (
              <pre className="details-payload">
                {/* `JSON.stringify` is used to format the details object for easy reading. */}
                {JSON.stringify(notification.details, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
