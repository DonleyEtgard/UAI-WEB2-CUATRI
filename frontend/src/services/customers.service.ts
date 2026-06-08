import { getWithCache, requestOrQueue } from "./offlineApi";

export interface Payment {
  amount: number;
  date: string;
}

export interface Customer {
  _id?: string;
  name: string;
  lastName?: string;
  address?: string;
  email?: string;
  phone?: string;

  user?: string; // 🔥 IMPORTANTE (Mongo ObjectId)

  debt?: number;

  payments?: {
    amount: number;
    date: string | Date;
  }[];

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

// ==========================
// API
// ==========================

// 📌 Obtener todos
export const getCustomers = async (): Promise<Customer[]> => {
  return getWithCache<Customer[]>("/customers");
};

// 📌 Obtener por ID
export const getCustomerById = async (id: string): Promise<Customer> => {
  return getWithCache<Customer>(`/customers/${id}`);
};

// 📌 Crear cliente
export const createCustomer = async (
  data: Customer
): Promise<Customer> => {
  const fallbackCustomer: Customer = {
    ...data,
    _id: `offline_customer_${Date.now()}`,
    isActive: true,
    debt: data.debt || 0,
    payments: [],
  };

  const result = await requestOrQueue<Customer>(
    "POST",
    "/customers",
    data,
    fallbackCustomer
  );

  return result;
};

// 📌 Actualizar cliente
export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const result = await requestOrQueue<Customer>(
    "PUT",
    `/customers/${id}`,
    data
  );

  return result;
};

// 📌 Agregar pago (CORREGIDO endpoint + offline)
export const addPayment = async (
  id: string,
  amount: number
): Promise<Customer> => {
  const result = await requestOrQueue<Customer>(
    "POST",
    `/customers/${id}/payment`,
    { amount }
  );

  return result;
};

// 📌 Eliminar cliente (soft delete + offline)
export const deleteCustomer = async (id: string): Promise<void> => {
  await requestOrQueue<void>(
    "DELETE",
    `/customers/${id}`
  );
};