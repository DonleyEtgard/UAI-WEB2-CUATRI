const BASE_URL = "http://localhost:3000/api";

// 🔧 helper
const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token"); // 🔥 Firebase token

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export type RegisterData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "seller";
};

export type LoginData = {
  email: string;
  password: string;
};


// ==========================
// 🔐 AUTH
// ==========================

// 🟢 REGISTER
export const registerUser = (data: RegisterData) => {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// 🔐 LOGIN
export const loginUser = async (data: LoginData) => {
  const res = await request("/users/login", {
    method: "POST",
    body: JSON.stringify(data)
  });

  // 🔥 guardar token automáticamente
  if (res.idToken) {
    localStorage.setItem("token", res.idToken);
  }

  return res;
};


// ==========================
// 👤 USERS (ADMIN)
// ==========================

// 🔄 ACTIVAR / DESACTIVAR
export const toggleUserStatus = (id: string) => {
  return request(`/users/${id}/toggle-status`, {
    method: "PATCH"
  });
};


// ==========================
// 💳 SUBSCRIPTION / PAYMENTS
// ==========================

// 💰 PAGAR SUSCRIPCIÓN
export const paySubscription = (paymentMethod: string) => {
  return request("/users/pay-subscription", {
    method: "POST",
    body: JSON.stringify({ paymentMethod })
  });
};

// 📲 GENERAR QR (Moncash)
export const createSubscriptionPayment = () => {
  return request("/users/create-payment", {
    method: "POST"
  });
};