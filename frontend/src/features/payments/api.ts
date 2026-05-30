import * as paymentService from "../../services/payments.service";

import type {
  PaymentMethod,
  Payment,
} from "../../services/payments.service";

// ============================================================================
// TYPES (re-export para conveniencia en el feature)
// ============================================================================

export type {
  PaymentMethod,
  Payment,
};

// ============================================================================
// PAYMENT METHODS API
// ============================================================================

// 📌 GET ALL
export const fetchPaymentMethods = paymentService.getPaymentMethods;

// 📌 GET ONE
export const fetchPaymentMethodById = paymentService.getPaymentMethodById;

// ➕ CREATE
export const createPaymentMethodAction = paymentService.createPaymentMethod;

// ✏️ UPDATE
export const updatePaymentMethodAction = paymentService.updatePaymentMethod;

// ❌ DELETE
export const deletePaymentMethodAction = paymentService.deletePaymentMethod;

// ============================================================================
// SUBSCRIPTION PAYMENTS API
// ============================================================================

// 💳 PAY SUBSCRIPTION
export const paySubscriptionAction = paymentService.paySubscription;

// 🔥 CREATE PAYMENT QR
export const createSubscriptionPaymentAction = paymentService.createSubscriptionPayment;