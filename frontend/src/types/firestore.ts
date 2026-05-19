export type UserRole = "superadmin" | "admin" | "employee";

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  plan?: "free" | "basic" | "active" | "suspended";
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  price: number;
  cost?: number;
  stock: number;
  active: boolean;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  name: string;
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
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Sale {
  id: string;
  organizationId: string;
  customerId: string;
  createdBy: string;
  status: "pending" | "completed" | "cancelled";
  total: number;
  items?: SaleItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: string;
  organizationId: string;
  productId: string;
  changedBy: string;
  quantity: number;
  reason: "sale" | "inventory" | "adjustment" | "return";
  note?: string;
  createdAt?: string;
}

export interface Report {
  id: string;
  organizationId: string;
  type: "sales" | "inventory" | "users" | "custom";
  generatedBy: string;
  period: string;
  data: Record<string, unknown>;
  createdAt?: string;
}
