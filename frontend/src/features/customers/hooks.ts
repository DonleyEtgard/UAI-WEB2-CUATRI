import { useEffect, useState } from "react";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addPayment,
} from "../../services/customers.service";

import type { Customer } from "../../services/customers.service";

// ========================================
// GET CUSTOMERS
// ========================================

export const useCustomers = () => {

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadCustomers = async () => {

    try {

      setLoading(true);

      setError(null);

      const data =
        await getCustomers();

      setCustomers(data);

    } catch (err: any) {

      setError(
        err.message ||
        "Error loading customers"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    reload: loadCustomers,
  };
};

// ========================================
// GET CUSTOMER
// ========================================

export const useCustomer = (
  id?: string
) => {

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(false);

  const loadCustomer = async () => {

    if (!id) return;

    try {

      setLoading(true);

      const data =
        await getCustomerById(id);

      setCustomer(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomer();
  }, [id]);

  return {
    customer,
    loading,
    reload: loadCustomer,
  };
};

// ========================================
// CREATE CUSTOMER
// ========================================

export const useCreateCustomer = () => {

  const [loading, setLoading] =
    useState(false);

  const handleCreate = async (
    data: Customer
  ) => {

    try {

      setLoading(true);

      return await createCustomer(data);

    } finally {

      setLoading(false);
    }
  };

  return {
    handleCreate,
    loading,
  };
};

// ========================================
// UPDATE CUSTOMER
// ========================================

export const useUpdateCustomer = () => {

  const [loading, setLoading] =
    useState(false);

  const handleUpdate = async (
    id: string,
    data: Partial<Customer>
  ) => {

    try {

      setLoading(true);

      return await updateCustomer(
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

// ========================================
// DELETE CUSTOMER
// ========================================

export const useDeleteCustomer = () => {

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async (
    id: string
  ) => {

    try {

      setLoading(true);

      return await deleteCustomer(id);

    } finally {

      setLoading(false);
    }
  };

  return {
    handleDelete,
    loading,
  };
};

// ========================================
// ADD PAYMENT
// ========================================

export const useAddPayment = () => {

  const [loading, setLoading] =
    useState(false);

  const handleAddPayment = async (
    id: string,
    amount: number
  ) => {

    try {

      setLoading(true);

      return await addPayment(
        id,
        amount
      );

    } finally {

      setLoading(false);
    }
  };

  return {
    handleAddPayment,
    loading,
  };
};