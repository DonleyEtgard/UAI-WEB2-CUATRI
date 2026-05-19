import API from "./api";

// ==========================
// TYPES
// ==========================

export type StockMovement = {
  _id: string;
  product: any;
  type: "in" | "out";
  quantity: number;
  user: any;
  reason: string;
  stockAfter: number;
  createdAt: string;
};

export type CreateStockMovement = {
  product: string;
  type: "in" | "out";
  quantity: number;
  user: string;
  reason: string;
};

// ==========================
// STOCK API
// ==========================

// 📌 CREATE MOVEMENT
export const createStockMovement = async (data: CreateStockMovement) => {
  const res = await API.post("/stock", data);
  return res.data;
};

// 📌 GET ALL MOVEMENTS
export const getStockMovements = async (): Promise<StockMovement[]> => {
  const res = await API.get("/stock");
  return res.data;
};

// 📌 GET BY PRODUCT
export const getMovementsByProduct = async (
  productId: string
): Promise<StockMovement[]> => {
  const res = await API.get(`/stock/product/${productId}`);
  return res.data;
};

// 📌 GET BY ID
export const getStockMovementById = async (
  id: string
): Promise<StockMovement> => {
  const res = await API.get(`/stock/${id}`);
  return res.data;
};

// 📊 SUMMARY (in / out totals)
export const getStockSummary = async () => {
  const res = await API.get("/stock/summary");
  return res.data;
};