// client/src/components/ui/Modal/Modal.jsx

import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  // If the modal isn't open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // The "modal-overlay" is the dark background. Clicking it will close the modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* We stop the click from propagating to the overlay, so clicking the content doesn't close it. */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* The main content passed from the parent component will be displayed here. */}
        {children}
        <button className="modal-close-button" onClick={onClose}>
          &times; {/* This is a simple "X" character for the close icon */}
        </button>
      </div>
    </div>
  );
};

export default Modal;
