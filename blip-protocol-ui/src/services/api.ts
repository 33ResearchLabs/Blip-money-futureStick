import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  },
);
