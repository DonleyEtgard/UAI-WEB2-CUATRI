import API from "./api";
import { getWithCache, requestOrQueue } from "./offlineApi";

// Importar tipos de modelos para usarlos en el servicio
import type { Sale as ModelSale, SaleItem as ModelSaleItem, Currency as ModelCurrency, SaleStatus as ModelSaleStatus } from "../models/sale";

// ==========================
// TYPES - AUTH
// ==========================

export interface TicketSale {
  _id: string;

  customer?: {
    name?: string;
    phone?: string;
  };

  user?: {
    email?: string;
    lastname?: string;
    name?: string;
  };

  createdAt: string;

  total: number;

  paymentMethod?: string;

  amountPaid?: number;

  change?: number;

  status?: string;

  notes?: string;
}

export interface TicketItem {
  _id: string;

  quantity: number;

  subtotal: number;

  product?: {
    name?: string;
  };

  productName?: string;
}

export interface TicketInfo {
  sale: TicketSale;
  items: TicketItem[];
  customer: any; // Tipo Customer si se necesita
  qrCode?: string;
}

export interface TicketData {
  sale: Sale;
  items: SaleItem[];
}

export type RegisterData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "employee" | "user" | "superadmin";
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
  paymentMethod: "cash" | "card" | "transfer" | "moncash" | "mercado-pago";
  items: SaleItemInput[];
  amountPaid?: number;
  notes?: string;
};

// Re-exportar tipos de modelos para que el feature los pueda importar desde aquí
export type Sale = ModelSale;
export type SaleItem = ModelSaleItem;
export type Currency = ModelCurrency;
export type SaleStatus = ModelSaleStatus;

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
    localStorage.setItem("firebaseToken", res.data.idToken);
  }

  return res.data;
};


// TOGGLE USER STATUS
export const toggleUserStatus = async (id: string) => {
  if (!id || id === "undefined") throw new Error("User ID is required");
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

export const createSubscriptionPayment = async (paymentMethod: string) => {
  const res = await API.post("/users/create-payment", { paymentMethod });
  return res.data;
};


// ======================================================
// 🛒 SALES
// ======================================================

// GET ALL SALES
export const getSales = async (): Promise<Sale[]> => {
  return await getWithCache<Sale[]>("/sales");
};

// CREATE SALE
export const createSale = async (data: CreateSaleData): Promise<Sale> => {
  if (!data.user) throw new Error("User ID is required to create a sale");
  // Fallback para creación offline
  const fallbackSale: Sale = {
    _id: `off_sale_${Date.now()}`,
    customerId: data.customer || "unknown", // Asumiendo un customerId por defecto si no se provee
    items: data.items.map(item => ({
      productId: item.product,
      quantity: item.quantity,
      unitPrice: 0, // Se calculará en el backend o se puede estimar
      totalPrice: 0, // Se calculará en el backend o se puede estimar
    })),
    subtotal: 0, // Se calculará en el backend
    totalAmount: data.amountPaid || 0, // Estimación inicial
    amountPaid: data.amountPaid || 0,
    currency: "USD", // Asumiendo una moneda por defecto
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await requestOrQueue<Sale>(
    "POST",
    "/sales",
    data,
    fallbackSale
  );
};


// GET ALL ITEMS
export const getSaleItems = async (): Promise<SaleItem[]> => {
  return await getWithCache<SaleItem[]>("/sale-items");
};

// GET ITEM BY ID
export const getSaleItemById = async (id: string): Promise<SaleItem> => {
  if (!id || id === "undefined") throw new Error("Item ID is required");
  return await getWithCache<SaleItem>(`/sale-items/${id}`);
};


// GET ITEMS BY SALE
export const getItemsBySale = async (saleId: string): Promise<SaleItem[]> => {
  if (!saleId || saleId === "undefined") throw new Error("Sale ID is required");
  return await getWithCache<SaleItem[]>(`/sale-items/sale/${saleId}`);
};


// DELETE ITEM
export const deleteSaleItem = async (id: string): Promise<{ message: string }> => {
  if (!id || id === "undefined") throw new Error("Item ID is required");
  return await requestOrQueue<{ message: string }>("DELETE", `/sale-items/${id}`);
};


// ======================================================
// 🎟️ TICKET
// ======================================================

// GET TICKET
export const getTicket = async (id: string): Promise<TicketInfo> => {
  if (!id || id === "undefined") throw new Error("Ticket ID is required");
  return await getWithCache<TicketInfo>(`/sales/ticket/${id}`);
};


// 📲 WHATSAPP SHARE
export const sendTicketWhatsApp = async (
  saleId: string,
  phone: string
): Promise<{ message: string }> => {
  if (!saleId) throw new Error("Sale ID is required");
  return await requestOrQueue<{ message: string }>(
    "POST",
    "/sales/ticket/send-whatsapp",
    {
      saleId,
      phone,
    }
  );

};


// 📨 TELEGRAM SHARE
export const sendTicketTelegram = async (
  saleId: string
): Promise<{ message: string }> => {
  if (!saleId) throw new Error("Sale ID is required");
  return await requestOrQueue<{ message: string }>(
    "POST",
    "/sales/ticket/send-telegram",
    {
      saleId,
    }
  );
};

// ======================================================
// 📊 REPORTS / STATS
// ======================================================

export const getSalesSummary = async (startDate?: string, endDate?: string): Promise<any> => {
  let url = "/sales/summary";
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString();
  return await getWithCache<any>(query ? `${url}?${query}` : url);
};