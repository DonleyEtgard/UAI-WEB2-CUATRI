import API from "./api";

// PERFIL
export const getMe = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

// REGISTER MONGO PROFILE
export const registerProfile = async (data: any) => {
  const res = await API.post("/users/register", data);
  return res.data;
};

// PAYMENT
export const paySubscription = async (paymentMethod: string) => {
  const res = await API.post("/users/pay-subscription", {
    paymentMethod,
  });

  return res.data;
};