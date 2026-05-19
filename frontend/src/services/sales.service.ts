import API from "./api";

// ==========================
// TYPES - AUTH
// ==========================

export type RegisterData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "employee";
};

export type LoginData = {
  email: string;
  password: string;
};

// ==========================
// TYPES - SALES
// ==========================

export type SaleItemInput = {
  product: string;
  quantity: number;
};

export type CreateSaleData = {
  customer?: string;
  user: string;
  paymentMethod: "cash" | "card" | "transfer";
  items: SaleItemInput[];
  amountPaid?: number;
  notes?: string;
};

// ======================================================
// 👤 USERS / AUTH
// ======================================================

// REGISTER
export const registerUser = async (data: RegisterData) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data: LoginData) => {
  const res = await API.post("/users/login", data);

  if (res.data.idToken) {
    localStorage.setItem("token", res.data.idToken);
  }

  return res.data;
};

// TOGGLE USER STATUS
export const toggleUserStatus = async (id: string) => {
  const res = await API.patch(`/users/${id}/toggle-status`);
  return res.data;
};

// SUBSCRIPTION PAYMENT
export const paySubscription = async (paymentMethod: string) => {
  const res = await API.post("/users/pay-subscription", {
    paymentMethod,
  });
  return res.data;
};

export const createSubscriptionPayment = async () => {
  const res = await API.post("/users/create-payment");
  return res.data;
};

// ======================================================
// 🛒 SALES
// ======================================================

// CREATE SALE
export const createSale = async (data: CreateSaleData) => {
  const res = await API.post("/sales", data);
  return res.data;
};

// GET ALL ITEMS
export const getSaleItems = async () => {
  const res = await API.get("/sales/items");
  return res.data;
};

// GET ITEM BY ID
export const getSaleItemById = async (id: string) => {
  const res = await API.get(`/sales/items/${id}`);
  return res.data;
};

// GET ITEMS BY SALE
export const getItemsBySale = async (saleId: string) => {
  const res = await API.get(`/sales/items/sale/${saleId}`);
  return res.data;
};

// DELETE ITEM
export const deleteSaleItem = async (id: string) => {
  const res = await API.delete(`/sales/items/${id}`);
  return res.data;
};

// GET TICKET
export const getTicket = async (id: string) => {
  const res = await API.get(`/sales/ticket/${id}`);
  return res.data;
};