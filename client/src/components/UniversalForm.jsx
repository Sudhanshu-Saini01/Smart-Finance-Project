// client/src/components/UniversalForm.jsx
// /----- VERSION V3 -----/

import React, { useState, useEffect } from "react";
import "./UniversalForm.css";

const UniversalForm = ({ title, config, onSubmit, submitText }) => {
  // Automatically create state based on the config file
  const initialState = config.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState("");

  // Reset form if the config changes (e.g., switching between forms)
  useEffect(() => {
    setFormData(initialState);
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    for (const field of config) {
      if (field.required && !formData[field.name]) {
        setError(`Please fill in the "${field.label}" field.`);
        return;
      }
    }
    setError("");
    onSubmit(formData); // Send the completed data object to the parent page
    setFormData(initialState); // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="universal-form">
      {title && <h2>{title}</h2>}
      {error && <p className="error-message full-width">{error}</p>}
      <div className="form-grid">
        {config.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder || ""}
                value={formData[field.name]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit" className="submit-btn full-width">
        {submitText || "Submit"}
      </button>
    </form>
  );
};

export default UniversalForm;
// /----- END VERSION V3 -----/
