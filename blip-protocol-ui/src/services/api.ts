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
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // ⚠️ NO Authorization header
    // Cookies are automatically attached by the browser
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Session expired");
        // Optional redirect to login
        // window.location.href = "/";
      }

      if (status === 403) {
        console.warn("Access denied");
      }
    } else {
      console.error("Network / CORS error");
    }

    return Promise.reject(error);
  }
);
