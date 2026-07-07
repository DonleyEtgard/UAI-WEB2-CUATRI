export interface Customer {
  _id?: string; // 🔥 MongoDB standard

  name: string;
  email?: string;
  phone?: string;
  address?: Address;

  // 💰 deuda actual
  debt: number;

  // 📅 historial de pagos
  payments: Payment[];

  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// 💳 pagos reales (mejorado)
export interface Payment {
  _id?: string;

  amount: number;

  date: string;

  method?: "cash" | "card" | "transfer";

  saleId?: string; // 🔥 link con ventas

  createdBy?: string; // usuario que registró pago
}