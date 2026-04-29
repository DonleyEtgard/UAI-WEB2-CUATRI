const BASE_URL = "http://localhost:3000/api";

// 🔧 helper reutilizable
const request = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};

// ==========================
// 👤 TYPES
// ==========================

export type User = {
  _id: string;
  email: string;
  role: "superadmin" | "admin" | "seller";
  isActive: boolean;
};

// ==========================
// 🔐 AUTH
// ==========================

// 🟢 REGISTER
export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  role?: "admin" | "seller";
}) => {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔐 LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// ==========================
// 👥 USERS
// ==========================

// 📋 GET ALL (⚠️ necesitas backend)
export const getUsers = async (): Promise<User[]> => {
  return request("/users");
};

// 🔄 TOGGLE STATUS
export const toggleUserStatus = async (id: string) => {
  return request(`/users/${id}/toggle-status`, {
    method: "PATCH"
  });
};