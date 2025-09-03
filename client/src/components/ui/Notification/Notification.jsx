// client/src/components/ui/Notification/Notification.jsx
import React, { useContext } from "react";
import { NotificationContext } from "@/context/NotificationContext";
import { CheckCircle, XCircle, Info } from "lucide-react";
import "./Notification.css";

const icons = {
  success: <CheckCircle size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
};

const Notification = ({ notification }) => {
  const { removeNotification } = useContext(NotificationContext);
  return (
    <div className={`notification-toast ${notification.type}`}>
      <div className="toast-icon">
        {icons[notification.type] || <Info size={20} />}
      </div>
      <p className="toast-message">{notification.message}</p>
      <button
        onClick={() => removeNotification(notification.id)}
        className="toast-close-btn"
      >
        &times;
      </button>
    </div>
  );
};

const NotificationContainer = () => {
  const { notifications } = useContext(NotificationContext);
  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <Notification key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default NotificationContainer;
