import { getWithCache, requestOrQueue } from "./offlineApi";

// ==========================
// Interfaces
// ==========================

export interface Payment {
  amount: number;
  date: string | Date;
  type?: "initial" | "payment";
  remainingDebt?: number;

  createdBy?: string;
  ownerAdmin?: string;
}

export interface Customer {
  _id?: string;

  name: string;
  lastName?: string;

  address?: string;
  email?: string;
  phone?: string;

  debt?: number;

  /**
   * El backend lo recibe al crear un cliente
   * y luego calcula debt = debt - initialPayment
   */
  initialPayment?: number;
  payments?: Payment[];
  isActive?: boolean;

  user?: string;
  createdBy?: string;
  ownerAdmin?: string;

  createdAt?: string;
  updatedAt?: string;
}

// ==========================
// API
// ==========================

// Obtener todos los clientes
export const getCustomers = async (): Promise<Customer[]> => {
  const response = await getWithCache<Customer[]>("/customers");

  console.log("SERVICE RESPONSE:", response);

  return response;
};

// Obtener cliente por ID
export const getCustomerById = async (
  id: string
): Promise<Customer> => {
  return await getWithCache<Customer>(`/customers/${id}`);
};

// Crear cliente
export const createCustomer = async (
  data: Customer
): Promise<Customer> => {

  const totalDebt = Number(data.debt ?? 0);
const paid = Number(data.initialPayment ?? 0);

const remainingDebt = Math.max(0, totalDebt - paid);

const fallbackCustomer: Customer = {
  ...data,
  _id: `offline_customer_${Date.now()}`,
  isActive: true,

  debt: remainingDebt,

  payments:
    paid > 0
      ? [
          {
            amount: paid,
            type: "initial",
            remainingDebt,
            date: new Date(),
          },
        ]
      : [],
};
  return await requestOrQueue<Customer>(
    "POST",
    "/customers",
    data,
    fallbackCustomer
  );
};

// Actualizar cliente
export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  return await requestOrQueue<Customer>(
    "PUT",
    `/customers/${id}`,
    data
  );
};

// Agregar pago
export const addPayment = async (
  id: string,
  amount: number
): Promise<Customer> => {
  return await requestOrQueue<Customer>(
    "POST",
    `/customers/${id}/payment`,
    {
      amount,
    }
  );
};


// Eliminar cliente (soft delete)
export const deleteCustomer = async (
  id: string
): Promise<{ message: string }> => {
  return await requestOrQueue<{ message: string }>(
    "DELETE",
    `/customers/${id}`
  );
};