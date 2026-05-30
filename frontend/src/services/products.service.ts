import API from "./api";
import { getWithCache, requestOrQueue } from "./offlineApi";
// ==========================
// TYPES
// ==========================

export type Currency = "ARS" | "USD" | "EUR";

export type Category = {
  _id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;

  price: number;
  cost?: number;

  currency?: Currency;

  stock: number;

  category?: Category;

  images?: string[];

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type ProductStats = {
  totalSold: number;
  revenue: number;
  stockHistory?: unknown[];
};

// ==========================
// API
// ==========================

// 🔄 GET ALL
export const getProducts = async (): Promise<Product[]> => {
  return await getWithCache<Product[]>("/products");
};

// 🔍 GET ONE
export const getProductById = async (id: string): Promise<Product> => {
  return await getWithCache<Product>(`/products/${id}`);
};

// ➕ CREATE
export const createProduct = async (
  data: Omit<Product, "_id" | "isActive">
): Promise<Product> => {
  // Fallback para creación offline
  const fallbackProduct: Product = {
    ...data,
    _id: `off_${Date.now()}`, // Generar un ID temporal para el modo offline
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return await requestOrQueue<Product>(
    "POST",
    "/products",
    data,
    fallbackProduct
  );
};

// ✏️ UPDATE
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  // Fallback para actualización offline (asume que el producto ya existe en caché)
  const fallbackProduct: Partial<Product> = {
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return await requestOrQueue<Product>(
    "PUT",
    `/products/${id}`,
    data,
    fallbackProduct as Product // Cast para asegurar que el tipo sea Product
  );
};

// ❌ DELETE
export const deleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  return await requestOrQueue<{ message: string }>("DELETE", `/products/${id}`);
};

// 📦 STOCK
export const updateStock = async (
  id: string,
  quantity: number
): Promise<Product> => {
  // Fallback para actualización de stock offline
  const fallbackStockUpdate: Partial<Product> = { stock: quantity, updatedAt: new Date().toISOString() };
  return await requestOrQueue<Product>("PATCH", `/products/${id}/stock`, { quantity }, fallbackStockUpdate as Product);
};

// 📊 STATS
export const getProductStats = async (
  id: string
): Promise<ProductStats> => {
  return await getWithCache<ProductStats>(`/products/${id}/stats`);
};