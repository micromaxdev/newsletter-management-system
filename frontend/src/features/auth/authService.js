import axios from "axios";

const API_URL = "/api/users/";

// Login user
export const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData, {
    withCredentials: true,
  });
  return response.data;
};

// Register user
export const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

// Logout user
export const logout = async () => {
  await axios.post(API_URL + "logout", {}, { withCredentials: true });
};
