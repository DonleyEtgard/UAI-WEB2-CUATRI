// ============================================================================
// API CONFIGURATION - Axios instance with Firebase token interceptor
// ============================================================================

import axios from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const getApiUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
        if (import.meta.env.PROD) {
            throw new Error("VITE_API_URL no está definida");
        }

        return "http://localhost:3000/api";
    }

    return apiUrl;
};

const API_BASE_URL = getApiUrl();

    console.log("CONFIG API_BASE_URL =", API_BASE_URL);
    console.log("PROD =", import.meta.env.PROD);

/**
 * Create and configure the main API instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ============================================================================
// REQUEST INTERCEPTOR - Add Firebase Token
// ============================================================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("firebaseToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR - Handle errors
// ============================================================================

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear invalid token
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/auth/login";

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
      window.location.href = "/unauthorized";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
