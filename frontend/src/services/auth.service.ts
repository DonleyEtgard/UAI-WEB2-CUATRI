import API from "./api";

// 🔐 LOGIN
export const login = async (email: string, password: string) => {
  const res = await API.post("/users/login", {
    email,
    password
  });

  return res.data;
};

// 🟢 REGISTER
export const register = async (data: {
  email: string;
  password: string;
  name: string;
  lastName: string;
}) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

// 🔄 TOGGLE USER (solo admin/superadmin)
export const toggleUserStatus = async (id: string) => {
  const res = await API.patch(`/users/${id}/toggle-status`);
  return res.data;
};

// 💳 PAGO SUSCRIPCIÓN
export const paySubscription = async (paymentMethod: string) => {
  const res = await API.post("/users/pay", {
    paymentMethod
  });

  return res.data;
};