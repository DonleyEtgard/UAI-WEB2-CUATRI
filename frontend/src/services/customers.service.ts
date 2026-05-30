import API from "./api";
import { getWithCache, requestOrQueue } from "./offlineApi";

export interface Payment {
  amount: number;
  date: string;
}

export interface Customer {
  _id?: string;

  // ✅ COINCIDE CON BACKEND
  name: string;

  email?: string;

  phone?: string;

  debt?: number;

  payments?: Payment[];

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}


// ==========================
// API
// ==========================

// 📌 Obtener todos
export const getCustomers = async (): Promise<Customer[]> => {
  return await getWithCache<Customer[]>("/customers");
};


// 📌 Obtener por ID
export const getCustomerById = async (
  id: string
): Promise<Customer> => {

  return await getWithCache<Customer>(
    `/customers/${id}`
  );
};


// 📌 Crear cliente
export const createCustomer = async (
  data: Customer
): Promise<Customer> => {

  // ✅ fallback offline
  const fallbackCustomer: Customer = {
    ...data,

    _id: `offline_customer_${Date.now()}`,

    isActive: true,

    debt: data.debt || 0,

    payments: [],
  };

  return await requestOrQueue<Customer>(
    "POST",
    "/customers",
    data,
    fallbackCustomer
  );
};


// 📌 Actualizar cliente
export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {

  const res = await API.put(
    `/customers/${id}`,
    data
  );

  return res.data;
};


// 📌 Agregar pago
export const addPayment = async (
  id: string,
  amount: number
): Promise<Customer> => {

  const res = await API.post(
    `/customers/${id}/payment`,
    {
      amount
    }
  );

  return res.data;
};


// 📌 Eliminar cliente (soft delete)
export const deleteCustomer = async (
  id: string
) => {

  const res = await API.delete(
    `/customers/${id}`
  );

  return res.data;
};