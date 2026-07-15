export type UserRole = "superadmin" | "admin" | "employee";
export type Currency = "ARS" | "HTG";

export interface AppUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  lastName?: string;
  role: UserRole;
  ownerAdmin?: string;
  createdBy?: string;

  plan?: "free" | "basic" | "active" | "suspended";

  subscriptionStart?: string;
  subscriptionEnd?: string;

  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  isActive: boolean;
  isVerified: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  price: number;
  cost?: number;
  stock: number;
  createdBy: string;
  ownerAdmin: string;
  currency?: Currency;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  debt?: number;
  user: string;
  createdBy: string;
  ownerAdmin: string;

  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

export interface SaleItem {
  _id: string;
  sale: string;
  product: string;
  quantity: number;
  price: number;
  subtotal: number;
  createdBy: string;
  ownerAdmin: string;
}

export interface Sale {
  _id: string;
  customer?: string;
  user: string;
  createdBy: string;
  ownerAdmin: string;
  status:
    | "pending"
    | "paid"
    | "cancelled";

  total: number;
  amountPaid?: number;
  change?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  _id: string;
  product: string;
  type: "in" | "out";
  quantity: number;
  user: string;
  reason: string;
  createdBy: string;
  ownerAdmin: string;
  sale?: string;
  stockAfter: number;
  createdAt?: string;
}

export interface Report {
  _id: string;
  type: "sales" | "inventory" | "users" | "custom";
  generatedBy: string;
  period: string;
  data: Record<string, unknown>;
  createdAt?: string;
}