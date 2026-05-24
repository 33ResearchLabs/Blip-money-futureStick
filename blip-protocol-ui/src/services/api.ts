import axios from "axios";

// In dev (vite serve), prefer the same-origin "/api" path so the Vite proxy
// forwards to the Railway backend without triggering CORS preflight. In
// production builds the absolute VITE_BACKEND_URL is used as-is.
const IS_DEV = import.meta.env.DEV;
const API_BASE_URL = IS_DEV ? "/api" : import.meta.env.VITE_BACKEND_URL;

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
