import API from "./axios";

// 📌 OBTENER TODOS LOS CLIENTES
export const getCustomers = async () => {
  const res = await API.get("/customers");
  return res.data;
};

// 📌 OBTENER CLIENTE POR ID
export const getCustomerById = async (id: string) => {
  const res = await API.get(`/customers/${id}`);
  return res.data;
};

// 📌 CREAR CLIENTE
export const createCustomer = async (data: {
  name: string;
  email?: string;
  phone?: string;
}) => {
  const res = await API.post("/customers", data);
  return res.data;
};

// 📌 ACTUALIZAR CLIENTE
export const updateCustomer = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
  }
) => {
  const res = await API.put(`/customers/${id}`, data);
  return res.data;
};

// 📌 ELIMINAR (SOFT DELETE)
export const deleteCustomer = async (id: string) => {
  const res = await API.delete(`/customers/${id}`);
  return res.data;
};