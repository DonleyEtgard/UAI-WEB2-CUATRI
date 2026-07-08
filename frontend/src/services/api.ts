import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

  console.log("API_URL =", API_URL);

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("firebaseToken");

  if (import.meta.env.DEV) {
    console.log("========== API REQUEST ==========");
    console.log("METHOD:", config.method?.toUpperCase());
    console.log("URL:", config.url);
    console.log("TOKEN EXISTS:", !!token);
    console.log("BASE URL:", config.baseURL);
    console.log("URL:", config.url);
    console.log("Authorization:", token ? "Sí" : "No");

  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("========== API ERROR ==========");
    console.error("STATUS:", error.response?.status);
    console.error("URL:", error.config?.url);
    console.error("RESPONSE:", error.response?.data);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    console.log("MESSAGE:", error.message);

    if (error.response?.status === 401) {
      console.warn("401 Unauthorized");
    }

    if (error.response?.status === 403) {
      console.warn("403 Forbidden");
    }

    return Promise.reject(error);
  }
);

export default API;