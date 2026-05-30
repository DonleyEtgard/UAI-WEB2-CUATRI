import API from "./api";
import { getWithCache, requestOrQueue } from "./offlineApi";

// Importar tipos de modelos para usarlos en el servicio
import type { Sale as ModelSale, SaleItem as ModelSaleItem, Currency as ModelCurrency, SaleStatus as ModelSaleStatus } from "../models/sale";

// ==========================
// TYPES - AUTH
// ==========================

export type RegisterData = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: "admin" | "employee" | "manager" | "superadmin";
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

  // ✅ FIX: coincide con interceptor (auth_token)
  if (res.data.idToken) {
    localStorage.setItem("auth_token", res.data.idToken);
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

// GET ALL SALES
export const getSales = async (): Promise<Sale[]> => {
  return await getWithCache<Sale[]>("/sales");
};

// CREATE SALE
export const createSale = async (data: CreateSaleData): Promise<Sale> => {
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
  return await getWithCache<SaleItem[]>("/sales/items");
};


// GET ITEM BY ID
export const getSaleItemById = async (id: string): Promise<SaleItem> => {
  return await getWithCache<SaleItem>(`/sales/items/${id}`);
};


// GET ITEMS BY SALE
export const getItemsBySale = async (saleId: string): Promise<SaleItem[]> => {
  return await getWithCache<SaleItem[]>(`/sales/items/sale/${saleId}`);
};


// DELETE ITEM
export const deleteSaleItem = async (id: string): Promise<{ message: string }> => {
  return await requestOrQueue<{ message: string }>("DELETE", `/sales/items/${id}`);
};


// ======================================================
// 🎟️ TICKET
// ======================================================
// Nota: El tipo de retorno para getTicket no está definido en los modelos proporcionados.
// Asumo que devuelve un objeto con la información del ticket.
export type TicketInfo = {
  sale: Sale;
  customer: any; // Tipo Customer si se necesita
  items: SaleItem[];
  qrCode?: string;
  // ... otros campos del ticket
};

// GET TICKET
export const getTicket = async (id: string): Promise<TicketInfo> => {
  return await getWithCache<TicketInfo>(`/sales/ticket/${id}`);
};


// 📲 WHATSAPP SHARE
export const sendTicketWhatsApp = async (
  saleId: string,
  phone: string
): Promise<{ message: string }> => {
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