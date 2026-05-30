import { getWithCache, requestOrQueue } from "./offlineApi";

export type UserRole =
  | "superadmin"
  | "admin"
  | "manager"
  | "employee"
  | "user";

export type Address = {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type RegisterData = {
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  address?: Address;
};

export type UpdateUserData = {
  name?: string;
  lastName?: string;
  email?: string;
  image?: string;
  address?: Address;
  isActive?: boolean;
  role?: UserRole;
};

export type CreateEmployeeData = {
  firebaseUid: string;
  name: string;
  lastName: string;
  email: string;
  image?: string;
  address?: Address;
};

// ==========================
// AUTH
// ==========================

export const registerUser = async (data: RegisterData) => {
  return await requestOrQueue("POST", "/users/register", data);
};

// ==========================
// USERS
// ==========================

export const getMe = async () => {
  return await getWithCache<any>("/users/me");
};

export const getUsers = async (page = 1, limit = 10) => {
  return await getWithCache<any>(`/users?page=${page}&limit=${limit}`);
};

export const getUserById = async (id: string) => {
  return await getWithCache<any>(`/users/${id}`);
};

export const updateUser = async (id: string, data: UpdateUserData) => {
  return await requestOrQueue("PATCH", `/users/${id}`, data);
};

export const createEmployee = async (data: CreateEmployeeData) => {
  return await requestOrQueue("POST", "/users/employees", data);
};

// ==========================
// PAYMENTS
// ==========================

export const paySubscription = async (paymentMethod: string) => {
  return await requestOrQueue("POST", "/users/pay-subscription", { paymentMethod });
};

export const createSubscriptionPayment = async () => {
  return await requestOrQueue("POST", "/users/create-payment");
};