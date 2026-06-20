import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addPayment,
} from "../../services/customers.service";

import type {
  Customer,
  Payment,
} from "../../services/customers.service";


export type {
  Customer,
  Payment,
};

// ============================================================================
// CUSTOMERS API LAYER
// ============================================================================

// 📌 GET ALL
export const fetchCustomers =
  async (): Promise<Customer[]> => {

    return await getCustomers();
  };

// 📌 GET BY ID
export const fetchCustomerById =
  async (
    id: string
  ): Promise<Customer> => {

    return await getCustomerById(id);
  };

// 📌 CREATE
export const createCustomerAction =
  async (
    data: Customer
  ): Promise<Customer> => {

    return await createCustomer(data);
  };

// 📌 UPDATE
export const updateCustomerAction =
  async (
    id: string,
    data: Partial<Customer>
  ): Promise<Customer> => {

    return await updateCustomer(
      id,
      data
    );
  };

// 📌 DELETE
export const deleteCustomerAction =
  async (
    id: string
  ) => {

    return await deleteCustomer(id);
  };

// 📌 ADD PAYMENT
export const addPaymentAction =
  async (
    id: string,
    amount: number
  ): Promise<Customer> => {

    return await addPayment(
      id,
      amount
    );
  };
