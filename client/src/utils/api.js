// client/src/utils/api.js

import axios from "axios";

// Create a new Axios instance with a base URL for our server
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// This is an "interceptor" — a function that runs BEFORE every request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (this is where AuthContext saves it)
    const token = localStorage.getItem("token");

    // If the token exists, add it to the request's Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified request configuration
    return config;
  },
  (error) => {
    // If there's an error during this process, we reject the promise
    return Promise.reject(error);
  }
);

export default api;
