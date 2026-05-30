export interface Product {
  _id: string;

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

export type Currency = "ARS" | "USD" | "EUR";

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
}

export interface ProductFilters {
  search?: string;

  categoryId?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  isActive?: boolean;
}