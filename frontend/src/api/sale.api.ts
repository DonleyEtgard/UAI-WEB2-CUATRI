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
// 🛒 TYPES
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

export type SaleResponse = {
  sale: any;
  change: number;
};


// ==========================
// 🛒 SALES API
// ==========================

// ➕ CREAR VENTA
export const createSale = async (
  data: CreateSaleData
): Promise<SaleResponse> => {
  return request("/sales", {
    method: "POST",
    body: JSON.stringify(data)
  });
};


// ==========================
// 📦 SALE ITEMS
// ==========================

// 🔄 TODOS LOS ITEMS
export const getSaleItems = async () => {
  return request("/sale-items");
};

// 🔍 ITEM POR ID
export const getSaleItemById = async (id: string) => {
  return request(`/sale-items/${id}`);
};

// 📦 ITEMS POR VENTA
export const getItemsBySale = async (saleId: string) => {
  return request(`/sale-items/sale/${saleId}`);
};

// ❌ ELIMINAR ITEM
export const deleteSaleItem = async (id: string) => {
  return request(`/sale-items/${id}`, {
    method: "DELETE"
  });
};


// ==========================
// 🧾 TICKET
// ==========================

export const getTicket = async (id: string) => {
  return request(`/ticket/${id}`);
};