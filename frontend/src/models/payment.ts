export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export type PaymentMethod =
  | "cash"
  | "credit_card"
  | "debit_card"
  | "bank_transfer"
  | "mercado_pago";

export interface Payment {
  id: string;
  customerId: string;
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  status: PaymentStatus;
  metadata?: PaymentMetadata;
  createdAt?: string;
  updatedAt?: string;
}

export type Currency = "ARS" | "USD" | "HT";

export interface PaymentMetadata {
  transactionId?: string;
  paymentGateway?: string; // ej: Stripe, MercadoPago
  last4?: string; // últimos 4 dígitos tarjeta
}