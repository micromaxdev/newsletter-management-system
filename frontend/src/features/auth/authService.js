// import axios from "axios";

// const API_URL = process.env.REACT_APP_API_URL;

// // Login user
// export const login = async (userData) => {
//   const response = await axios.post(`${API_URL}/api/users/login`, userData, {
//     withCredentials: true,
//   });
//   return response.data;
// };

// // Register user
// export const register = async (userData) => {
//   const response = await axios.post(`${API_URL}/api/users/register`, userData);
//   return response.data;
// };

// // Logout user
// export const logout = async () => {
//   await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
// };

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/register`, userData, {
    withCredentials: true,
  });
  return response.data;
};

// Logout user
export const logout = async () => {
  await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
};