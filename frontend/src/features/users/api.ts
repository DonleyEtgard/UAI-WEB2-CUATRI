import API from "../../services/api";

// ==========================
// 👤 TYPES
// ==========================

export type User = {
  _id: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
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
  role?: "admin" | "employee";
}) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

// 🔐 LOGIN
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/users/login", data);
  return res.data;
};

// ==========================
// 👥 USERS
// ==========================

// 📋 GET ALL USERS
export const getUsers = async (): Promise<User[]> => {
  const res = await API.get("/users");
  return res.data;
};

// 🔄 TOGGLE STATUS
export const toggleUserStatus = async (id: string) => {
  const res = await API.patch(`/users/${id}/toggle-status`);
  return res.data;
};