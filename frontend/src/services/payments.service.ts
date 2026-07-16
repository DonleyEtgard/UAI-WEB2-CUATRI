import { getWithCache, requestOrQueue } from "./offlineApi";

export type PaymentMethodType =
  | "cash"
  | "card"
  | "transfer"
  | "moncash"
  | "mercadopago";

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

export type PaymentStatus =
  | "pending"
  | "pending_verification"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

// Basado en Payment.ts
export type Payment = {
  _id: string;
  user: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: "ARS" | "HTG";
  method: PaymentMethodType;

  provider: "mercadopago" | "moncash";
  status: PaymentStatus;
  providerStatus?: string;
  initPoint?: string;

  qrImage?: string;
  qrData?: string;

  transactionId?: string;
  externalReference?: string;
  receiptImage?: string;
  approvedBy?: string;
  approvedAt?: string;

  providerResponse?: Record<string, unknown>;
  createdBy?: string;

  ownerAdmin?: string;
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
// ==========================
// 💳 SUBSCRIPTION PAYMENTS
// ==========================

// 🔥 Crear pago (MercadoPago o MonCash)
export const createSubscriptionPayment = (
  plan: SubscriptionPlan,
  provider: PaymentMethodType
) => {
  return requestOrQueue<CreateSubscriptionPaymentResponse>(
    "POST",
    "/users/create-payment",
    {
      plan,
      provider,
    }
  );
};

// ==========================
// SUBSCRIPTION TYPES
// ==========================

export interface CreateSubscriptionPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentId: string;
  qr?: string;
  status?: string;
}

// ==========================
// PAYMENT METHODS API
// ==========================

// 📌 GET ALL
export const getPaymentMethods = async (): Promise<
  PaymentMethod[]
> => await getWithCache<PaymentMethod[]>("/payment-methods");

// 📌 GET ONE
export const getPaymentMethodById = async (
  id: string
): Promise<PaymentMethod> =>
  await getWithCache<PaymentMethod>(`/payment-methods/${id}`);

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

// 🔥 Alias para mantener compatibilidad
export const paySubscription = (
  plan: SubscriptionPlan,
  paymentMethod: PaymentMethodType
) => {
  return createSubscriptionPayment(
    plan,
    paymentMethod
  );
};