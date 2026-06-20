export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"
  | "cancelled";

export type PaymentMethod =
  | "cash"
  | "credit_card"
  | "debit_card"
  | "bank_transfer";

export type PaymentGateway =
  | "mercado_pago"
  | "stripe"
  | "paypal"
  | "manual";

export type Currency = "ARS" | "USD" | "EUR" | "BRL";

export interface Payment {
  _id: string; // 🔥 MongoDB standard

  customerId: string;

  amount: number;

  currency: Currency;

  method: PaymentMethod;

  gateway?: PaymentGateway;

  status: PaymentStatus;

  metadata?: PaymentMetadata;

  createdAt?: string;

  updatedAt?: string;
}

export interface PaymentMetadata {
  transactionId?: string;

  paymentGateway?: PaymentGateway;

  last4?: string;

  receiptUrl?: string;
}