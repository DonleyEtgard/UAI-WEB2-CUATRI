import API from "./api";
import { getWithCache, requestOrQueue } from "./offlineApi";

// ==========================
// TYPES
// ==========================

export type PaymentMethod = {
  _id: string;
  name: string;
  type: "cash" | "card" | "transfer";
  isActive: boolean;
};

// Basado en src/models/Payment.ts (Mongoose model)
export type Payment = {
  _id: string;
  user: string; // Asumiendo ObjectId se representa como string
  amount: number;
  method: "cash" | "transfer" | "moncash";
  status: "pending" | "paid" | "failed";
  qrData?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
};

// ==========================
// PAYMENT METHODS API
// ==========================

// 📌 GET ALL
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  return await getWithCache<PaymentMethod[]>("/payment-methods");
};

// 📌 GET ONE
export const getPaymentMethodById = async (
  id: string
): Promise<PaymentMethod> => {
  return await getWithCache<PaymentMethod>(`/payment-methods/${id}`);
};

// ➕ CREATE
export const createPaymentMethod = async (data: {
  name: string;
  type: "cash" | "card" | "transfer";
  isActive?: boolean;
}): Promise<PaymentMethod> => {
  // Fallback para creación offline
  const fallbackMethod: PaymentMethod = {
    ...data,
    _id: `off_${Date.now()}`, // Generar un ID temporal para el modo offline
    isActive: data.isActive ?? true,
  };
  return await requestOrQueue<PaymentMethod>(
    "POST",
    "/payment-methods",
    data,
    fallbackMethod
  );
};

// ✏️ UPDATE
export const updatePaymentMethod = async (
  id: string,
  data: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
  return await requestOrQueue<PaymentMethod>("PUT", `/payment-methods/${id}`, data);
};

// ❌ DELETE
export const deletePaymentMethod = async (
  id: string
): Promise<{ message: string }> => {
  return await requestOrQueue<{ message: string }>("DELETE", `/payment-methods/${id}`);
};

// ==========================
// 💳 SUBSCRIPTION PAYMENTS
// ==========================

// 🔥 Pagar suscripción
export const paySubscription = (paymentMethod: string) => {
  // Asumiendo que paySubscription devuelve un objeto Payment o similar
  return requestOrQueue<Payment>("POST", "/users/pay-subscription", { paymentMethod });
};

// 🔥 Generar QR / pago
export const createSubscriptionPayment = () => {
  // Asumiendo que createSubscriptionPayment devuelve un objeto con qr
  return requestOrQueue<{ qr: string }>("POST", "/users/create-payment");
};