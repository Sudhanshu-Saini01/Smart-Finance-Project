// // client/src/utils/api.js

// import axios from "axios";

// // Create a new Axios instance with a base URL for our server
// const api = axios.create({
//   baseURL: "http://localhost:3001/api",
// });

// // This is an "interceptor" — a function that runs BEFORE every request is sent.
// api.interceptors.request.use(
//   (config) => {
//     // Get the token from localStorage (this is where AuthContext saves it)
//     const token = localStorage.getItem("token");

//     // If the token exists, add it to the request's Authorization header
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Return the modified request configuration
//     return config;
//   },
//   (error) => {
//     // If there's an error during this process, we reject the promise
//     return Promise.reject(error);
//   }
// );

// export default api;

// client/src/utils/api.js

import axios from "axios";

// Create a new Axios instance with a base URL for our server.
// This is the single, authoritative API client for the entire application.
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Use an "interceptor" to run a function before every single request is sent.
// This is the most efficient way to add the authentication token to our headers.
api.interceptors.request.use(
  (config) => {
    // 1. Get the authentication token directly from localStorage.
    const token = localStorage.getItem("token");

    // 2. If the token exists, add it to the 'Authorization' header.
    // The `Bearer ${token}` format is a standard convention for sending JWTs.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Return the modified request configuration so the request can proceed.
    return config;
  },
  (error) => {
    // If there's an error during this process, reject the promise to handle it elsewhere.
    return Promise.reject(error);
  }
);

export default api;
