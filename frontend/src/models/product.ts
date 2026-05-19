export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  stock: number;
  category?: Category;
  images?: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Currency = "ARS" | "USD" | "HT";

export interface Category {
  id: string;
  name: string;
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}