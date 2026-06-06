import { getWithCache, requestOrQueue } from "./offlineApi";

export type PaymentMethodType =
  | "cash"
  | "card"
  | "transfer"
  | "moncash"
  | "mercado-pago";

export type SubscriptionPlan =
  | "basic"
  | "medium"
  | "premium";

export type PaymentMethod = {
  _id: string;
  name: string;
  type: PaymentMethodType;
  isActive: boolean;
};

// Basado en Payment.ts
export type Payment = {
  _id: string;
  user: string;
  amount: number;
  method: PaymentMethodType;
  status: "pending" | "paid" | "failed";
  qrData?: string;
  reference?: string;
  createdAt: string;
  updatedAt: string;
};

// ==========================
// SUBSCRIPTION TYPES
// ==========================

export interface SubscriptionPaymentResponse {
  success: boolean;
  message: string;
  plan: SubscriptionPlan;
  paymentMethod: PaymentMethodType;
  totalPaid: number;
  subscriptionEnd: string;
  qrCode?: string | null;
}

export interface CreateSubscriptionPaymentResponse {
  plan: SubscriptionPlan;
  basePrice: number;
  fee: number;
  total: number;
  qr: string;
}

// ==========================
// PAYMENT METHODS API
// ==========================

// 📌 GET ALL
export const getPaymentMethods = async (): Promise<
  PaymentMethod[]
> => {
  return await getWithCache<PaymentMethod[]>(
    "/payment-methods"
  );
};

// 📌 GET ONE
export const getPaymentMethodById = async (
  id: string
): Promise<PaymentMethod> => {
  return await getWithCache<PaymentMethod>(
    `/payment-methods/${id}`
  );
};

// ➕ CREATE
export const createPaymentMethod = async (data: {
  name: string;
  type: PaymentMethodType;
  isActive?: boolean;
}): Promise<PaymentMethod> => {
  const fallbackMethod: PaymentMethod = {
    ...data,
    _id: `off_${Date.now()}`,
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
  return await requestOrQueue<PaymentMethod>(
    "PUT",
    `/payment-methods/${id}`,
    data
  );
};

// ❌ DELETE
export const deletePaymentMethod = async (
  id: string
): Promise<{ message: string }> => {
  return await requestOrQueue<{
    message: string;
  }>(
    "DELETE",
    `/payment-methods/${id}`
  );
};

// ==========================
// 💳 SUBSCRIPTION PAYMENTS
// ==========================

// 🔥 Crear QR / pago
export const createSubscriptionPayment = (
  plan: SubscriptionPlan
) => {
  return requestOrQueue<CreateSubscriptionPaymentResponse>(
    "POST",
    "/users/create-payment",
    {
      plan,
    }
  );
};

// 🔥 Pagar suscripción
export const paySubscription = (
  plan: SubscriptionPlan,
  paymentMethod: PaymentMethodType
) => {
  return requestOrQueue<SubscriptionPaymentResponse>(
    "POST",
    "/users/pay-subscription",
    {
      plan,
      paymentMethod,
    }
  );
};