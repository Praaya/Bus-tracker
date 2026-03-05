import axios from "axios";

// Fallback for local development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const getAllBuses = async () => {
  const response = await api.get("/driver/buses");
  return response.data;
};

export default api;
