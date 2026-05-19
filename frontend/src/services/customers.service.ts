import API from "./api";
import { getWithCache, requestOrQueue } from "./offlineApi";

// ==========================
// TYPES
// ==========================

export interface Payment {
  amount: number;
  date: string;
}

export interface Customer {
  _id?: string;

  personalInfo: {
    firstName: string;
    lastName: string;
  };

  contactInfo: {
    email: string;
    phone?: string;
  };

  address?: {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };

  debt?: number;

  payments?: Payment[];

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

// ==========================
// API
// ==========================

export const getCustomers = async (): Promise<Customer[]> => {
  return await getWithCache<Customer[]>("/customers");
};

export const getCustomerById = async (
  id: string
): Promise<Customer> => {
  return await getWithCache<Customer>(
    `/customers/${id}`
  );
};

export const createCustomer = async (
  data: Customer
): Promise<Customer> => {

  const fallbackCustomer: Customer = {
    ...data,

    _id: `offline_customer_${Date.now()}`,

    isActive: true,
  };

  return await requestOrQueue<Customer>(
    "POST",
    "/customers",
    data,
    fallbackCustomer
  );
};

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

export const deleteCustomer = async (
  id: string
) => {

  const res = await API.delete(
    `/customers/${id}`
  );

  return res.data;
};