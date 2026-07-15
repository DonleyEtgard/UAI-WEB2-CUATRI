import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const getApiUrl = () => {
  // Forzar la URL local en modo de desarrollo para evitar confusiones
  if (import.meta.env.DEV) {
    return "http://localhost:3000/api";
  }

  // Usar la variable de entorno para producción
  const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error("VITE_API_URL is not defined in the production environment.");
  }
  return apiUrl;
};

const API_BASE_URL = getApiUrl();

console.log("API_URL =", API_BASE_URL);

/**
 * Main API instance
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("firebaseToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (import.meta.env.DEV) {
        console.log("========== API REQUEST ==========");
        console.log("METHOD:", config.method?.toUpperCase());
        console.log("BASE URL:", config.baseURL);
        console.log("URL:", config.url);
        console.log("TOKEN EXISTS:", !!token);
        console.log("Authorization:", token ? "Sí" : "No");

        if (config.data) {
          console.log("DATA:", config.data);
        }
      }

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error) => {
    const originalRequest = error.config;

    if (import.meta.env.DEV) {
      console.error("========== API ERROR ==========");
      console.error("STATUS:", error.response?.status);
      console.error("URL:", error.config?.url);
      console.error("DATA:", error.response?.data);
      console.error("RESPONSE:", error.response?.data);
      console.error("MESSAGE:", error.message);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.warn("401 Unauthorized");

      window.dispatchEvent(new Event("auth-error-401"));

      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.warn("403 Forbidden");

      console.error("Access forbidden:", error.response.data);
      window.location.href = "/unauthorized";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;