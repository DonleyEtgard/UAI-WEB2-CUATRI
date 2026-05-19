import API from "./api";

// ==========================
// 👤 TYPES
// ==========================

export type Address = {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type RegisterData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "employee";
  address?: Address; // 🔥 agregado
};

export type LoginData = {
  email: string;
  password: string;
};

// ==========================
// 🔐 AUTH
// ==========================

export const registerUser = (data: RegisterData) => {
  return API.post("/users/register", data);
};

export const loginUser = async (data: LoginData) => {
  const res = await API.post("/users/login", data);

  // 🔥 guardar token automáticamente
  if (res.data?.idToken) {
    localStorage.setItem("token", res.data.idToken);
  }

  return res.data;
};

// ==========================
// 👤 USERS
// ==========================

export const toggleUserStatus = (id: string) => {
  return API.patch(`/users/${id}/toggle-status`);
};

// ==========================
// 💳 PAYMENTS
// ==========================

export const paySubscription = (paymentMethod: string) => {
  return API.post("/users/pay-subscription", {
    paymentMethod,
  });
};

export const createSubscriptionPayment = () => {
  return API.post("/users/create-payment");
};