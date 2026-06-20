export type UserRole = "superadmin" | "admin" | "employee";
export type Currency = "ARS" | "USD" | "EUR";

export interface AppUser {
  _id: string;
  firebaseUid: string;
  email: string;
  name: string;
  lastName?: string;
  role: UserRole;
  organizationId?: string;
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
  organizationId: string;
  createdBy: string;
  price: number;
  cost?: number;
  stock: number;
  currency?: Currency;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  _id: string;
  name: string;
  organizationId: string;
  createdBy: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  debt?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaleItem {
  _id: string;
  sale: string;
  product: string;
  productName?: string;
  quantity: number;
  price: number;
  organizationId: string;
  createdBy: string;
  subtotal: number;
}

export interface Sale {
  _id: string;
  customer?: string;
  user: string;
  status: "pending" | "paid" | "cancelled";
  total: number;
  organizationId: string;
  createdBy: string;
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
  organizationId: string;
  createdBy: string;
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