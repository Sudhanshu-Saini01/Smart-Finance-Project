// client/src/components/UniversalForm.jsx

// --- Core Imports ---
import React, { useState, useEffect } from "react";
// --- Stylesheet Import ---
import "./UniversalForm.css";

/**
 * @component UniversalForm
 * @desc      A highly reusable component that can generate any form based on a configuration object.
 * @param {string} title - The title to display above the form.
 * @param {array} config - An array of objects, where each object defines a field in the form.
 * @param {function} onSubmit - The function to call with the form data when submitted.
 * @param {string} submitText - The text to display on the submit button.
 */
const UniversalForm = ({ title, config, onSubmit, submitText }) => {
  // --- State Initialization ---
  // This is a clever way to dynamically create the initial state for the form.
  // It loops through the `config` array and creates a key-value pair for each field,
  // setting its initial value to `defaultValue` or an empty string.
  const initialState = config.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  // `formData` state holds the current values of all the input fields.
  const [formData, setFormData] = useState(initialState);
  // `error` state holds any validation error messages to be displayed to the user.
  const [error, setError] = useState("");

  // --- Effects ---
  // This `useEffect` hook watches for changes in the `config` prop.
  // If the configuration changes (which might happen in a more complex app),
  // it resets the form data to the new initial state.
  useEffect(() => {
    setFormData(initialState);
  }, [config]); // The dependency array ensures this runs only when the config prop changes.

  // --- Event Handlers ---
  /**
   * @function handleChange
   * @desc     Updates the `formData` state whenever the user types in an input field or selects an option.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * @function handleSubmit
   * @desc     Handles the form submission process. It performs validation and, if successful,
   * calls the `onSubmit` function passed from the parent component.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default browser action of a full page reload on form submission.

    // This loop performs basic validation by checking if any required fields are empty.
    for (const field of config) {
      if (field.required && !formData[field.name]) {
        setError(`Please fill in the "${field.label}" field.`);
        return; // Stop the submission if a required field is empty.
      }
    }

    setError(""); // Clear any previous errors if validation passes.
    onSubmit(formData); // This is the key step: it sends the collected form data back to the parent component.
    setFormData(initialState); // Reset the form fields to their initial state after a successful submission.
  };

  // --- JSX Render ---
  return (
    <form onSubmit={handleSubmit} className="universal-form">
      {title && <h2>{title}</h2>}
      {error && <p className="error-message full-width">{error}</p>}
      <div className="form-grid">
        {/* This maps over the `config` array to render each form field dynamically. */}
        {config.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            {/* This is a conditional render: if the field type is 'select', it renders a dropdown... */}
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
              // ...otherwise, it renders a standard input field.
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
