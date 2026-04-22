import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "https://jandj-backend.onrender.com/api").trim();

export const api = axios.create({
  baseURL: API_BASE
});

export const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});
