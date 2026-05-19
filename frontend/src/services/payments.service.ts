import API from "./api";

// ==========================
// TYPES
// ==========================

export type PaymentMethod = {
  _id: string;
  name: string;
  type: "cash" | "card" | "transfer";
  isActive: boolean;
};

// ==========================
// PAYMENT METHODS API
// ==========================

// 📌 GET ALL
export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const res = await API.get("/payment-methods");
  return res.data;
};

// 📌 GET ONE
export const getPaymentMethodById = async (
  id: string
): Promise<PaymentMethod> => {
  const res = await API.get(`/payment-methods/${id}`);
  return res.data;
};

// ➕ CREATE
export const createPaymentMethod = async (data: {
  name: string;
  type: "cash" | "card" | "transfer";
  isActive?: boolean;
}): Promise<PaymentMethod> => {
  const res = await API.post("/payment-methods", data);
  return res.data;
};

// ✏️ UPDATE
export const updatePaymentMethod = async (id: string, data: any) => {
  const res = await API.put(`/payment-methods/${id}`, data);
  return res.data;
};

// ❌ DELETE
export const deletePaymentMethod = async (
  id: string
): Promise<{ message: string }> => {
  const res = await API.delete(`/payment-methods/${id}`);
  return res.data;
};

// ==========================
// 💳 SUBSCRIPTION PAYMENTS
// ==========================

// 🔥 Pagar suscripción
export const paySubscription = (paymentMethod: string) => {
  return API.post("/users/pay-subscription", {
    paymentMethod,
  });
};

// 🔥 Generar QR / pago
export const createSubscriptionPayment = () => {
  return API.post("/users/create-payment");
};