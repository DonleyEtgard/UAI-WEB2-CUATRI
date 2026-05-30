export interface Customer {
  _id?: string; // 🔥 MongoDB standard

  personalInfo: PersonalInfo;

  contactInfo: ContactInfo;

  address?: Address;

  // 💰 deuda actual
  debt: number;

  // 📅 historial de pagos
  payments: Payment[];

  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
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