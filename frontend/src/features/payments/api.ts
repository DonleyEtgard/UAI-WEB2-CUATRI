import API from "../../api/axios";

// 💳 PAGAR SUSCRIPCIÓN (cash / transfer / moncash)
export const paySubscription = async (paymentMethod: "cash" | "transfer" | "moncash") => {
  const res = await API.post("/users/pay-subscription", {
    paymentMethod
  });

  return res.data;
};

// 🔥 GENERAR QR MONCASH (sin pagar todavía)
export const createMoncashPayment = async () => {
  const res = await API.post("/users/create-subscription-payment");
  return res.data;
};

// 📊 OBTENER ESTADO DE SUSCRIPCIÓN
export const getSubscriptionStatus = async () => {
  const res = await API.get("/users/subscription-status");
  return res.data;
};