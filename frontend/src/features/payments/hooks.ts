import {
  useEffect,
  useState,
} from "react";

import {
  fetchPaymentMethods,
  fetchPaymentMethodById,
  createPaymentMethodAction,
  updatePaymentMethodAction,
  deletePaymentMethodAction,
  paySubscriptionAction,
  createSubscriptionPaymentAction,
} from "./api";

import type {
  PaymentMethod,
} from "./api";

export const usePaymentMethods = () => {

  const [methods, setMethods] =
    useState<PaymentMethod[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadMethods = async () => {

    try {

      setLoading(true);

      setError(null);

      const data =
        await fetchPaymentMethods();

      setMethods(data);

    } catch (err: any) {

      setError(
        err.message ||
        "Error loading payment methods"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadMethods();
  }, []);

  return {
    methods,
    loading,
    error,
    reload: loadMethods,
  };
};

// ============================================================================
// GET PAYMENT METHOD
// ============================================================================

export const usePaymentMethod = (
  id?: string
) => {

  const [method, setMethod] =
    useState<PaymentMethod | null>(null);

  const [loading, setLoading] =
    useState(false);

  const loadMethod = async () => {

    if (!id) return;

    try {

      setLoading(true);

      const data =
        await fetchPaymentMethodById(id);

      setMethod(data);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadMethod();
  }, [id]);

  return {
    method,
    loading,
    reload: loadMethod,
  };
};

// ============================================================================
// CREATE PAYMENT METHOD
// ============================================================================

export const useCreatePaymentMethod = () => {

  const [loading, setLoading] =
    useState(false);

  const handleCreate = async (
    data: {
      name: string;
      type: "cash" | "card" | "transfer";
      isActive?: boolean;
    }
  ) => {

    try {

      setLoading(true);

      return await createPaymentMethodAction(
        data
      );

    } finally {

      setLoading(false);
    }
  };

  return {
    handleCreate,
    loading,
  };
};

// ============================================================================
// UPDATE PAYMENT METHOD
// ============================================================================

export const useUpdatePaymentMethod = () => {

  const [loading, setLoading] =
    useState(false);

  const handleUpdate = async (
    id: string,
    data: Partial<PaymentMethod>
  ) => {

    try {

      setLoading(true);

      return await updatePaymentMethodAction(
        id,
        data
      );

    } finally {

      setLoading(false);
    }
  };

  return {
    handleUpdate,
    loading,
  };
};

// ============================================================================
// DELETE PAYMENT METHOD
// ============================================================================

export const useDeletePaymentMethod = () => {

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async (
    id: string
  ) => {

    try {

      setLoading(true);

      return await deletePaymentMethodAction(
        id
      );

    } finally {

      setLoading(false);
    }
  };

  return {
    handleDelete,
    loading,
  };
};

// ============================================================================
// SUBSCRIPTION PAYMENT
// ============================================================================

export const useSubscriptionPayment = () => {

  const [loading, setLoading] =
    useState(false);

  const [qr, setQr] =
    useState<string | null>(null);

  // 🔥 GENERATE QR
  const generateQR = async () => {

    try {

      setLoading(true);

      const res =
        await createSubscriptionPaymentAction();

      setQr(res.qr); // Corregido: res es directamente el objeto de datos, no res.data

      return res;

    } finally {

      setLoading(false);
    }
  };

  // 💳 CONFIRM PAYMENT
  const confirmPayment = async (
    paymentMethod: string
  ) => {

    try {

      setLoading(true);

      return await paySubscriptionAction(
        paymentMethod
      );

    } finally {

      setLoading(false);
    }
  };

  return {
    qr,
    loading,
    generateQR,
    confirmPayment,
  };
};
