import { useState } from "react";
import {
  paySubscription,
  createMoncashPayment,
  getSubscriptionStatus
} from "./api";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [qr, setQR] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // 🔥 GENERAR QR
  const generateQR = async () => {
    try {
      setLoading(true);
      const data = await createMoncashPayment();
      setQR(data.qr);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 💳 PAGAR SUSCRIPCIÓN
  const pay = async (method: "cash" | "transfer" | "moncash") => {
    try {
      setLoading(true);
      const res = await paySubscription(method);

      // 🔄 limpiar QR si pagó
      setQR(null);

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📊 ESTADO SUSCRIPCIÓN
  const loadSubscription = async () => {
    try {
      setLoading(true);
      const data = await getSubscriptionStatus();
      setSubscription(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    qr,
    subscription,
    generateQR,
    pay,
    loadSubscription
  };
};