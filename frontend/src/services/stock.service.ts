import { getWithCache, requestOrQueue } from "./offlineApi";

export type StockMovement = {
  _id: string;

  product: {
    _id: string;
    name?: string;
    price?: number;
  };

  type: "in" | "out";

  quantity: number;

  user: {
    _id: string;
    name?: string;
    email?: string;
  };

  reason: string;

  stockAfter: number;

  sale?: string;

  createdAt: string;
  updatedAt?: string;
};

// ==========================
// INPUT TYPE
// ==========================

export type CreateStockMovement = {
  product: string;
  type: "in" | "out";
  quantity: number;
  user: string;
  reason: string;
  sale?: string;
};

// ==========================
// STOCK API
// ==========================

// 📌 CREATE MOVEMENT
export const createStockMovement = async (
  data: CreateStockMovement
): Promise<StockMovement> => {
  const fallbackMovement: StockMovement = {
    _id: `off_stock_${Date.now()}`,
    product: { _id: data.product },
    type: data.type,
    quantity: data.quantity,
    user: { _id: data.user },
    reason: data.reason,
    stockAfter: 0, // Calculado por el backend sincrónicamente al reconectar
    sale: data.sale,
    createdAt: new Date().toISOString(),
  };

  return await requestOrQueue<StockMovement>("POST", "/stock", data, fallbackMovement);
};

// 📌 GET ALL MOVEMENTS
export const getStockMovements = async (): Promise<StockMovement[]> => {
  return await getWithCache<StockMovement[]>("/stock");
};

// 📌 GET BY PRODUCT
export const getMovementsByProduct = async (
  productId: string
): Promise<StockMovement[]> => {
  return await getWithCache<StockMovement[]>(`/stock/product/${productId}`);
};

// 📌 GET BY ID
export const getStockMovementById = async (
  id: string
): Promise<StockMovement> => {
  return await getWithCache<StockMovement>(`/stock/${id}`);
};

// 📊 SUMMARY (in / out totals)
export const getStockSummary = async () => {
  return await getWithCache<any>("/stock/summary");
};