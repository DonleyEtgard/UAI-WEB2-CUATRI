import API from "./api";

// ==========================
// TYPES
// ==========================

export type Product = {
  _id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  description?: string;
  category?: string;
  isActive: boolean;
};

// ==========================
// PRODUCTS API
// ==========================

// 🔄 GET ALL
export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get("/products");
  return res.data;
};

// 🔍 GET ONE
export const getProductById = async (id: string): Promise<Product> => {
  const res = await API.get(`/products/${id}`);
  return res.data;
};

// ➕ CREATE
export const createProduct = async (
  data: Omit<Product, "_id" | "isActive">
): Promise<Product> => {
  const res = await API.post("/products", data);
  return res.data;
};

// ✏️ UPDATE
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  const res = await API.put(`/products/${id}`, data);
  return res.data;
};

// ❌ DELETE (soft delete)
export const deleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await API.delete(`/products/${id}`);
  return res.data;
};

// 📦 UPDATE STOCK
export const updateStock = async (
  id: string,
  quantity: number
): Promise<Product> => {
  const res = await API.patch(`/products/${id}/stock`, {
    quantity,
  });
  return res.data;
};

// 📊 STATS
export const getProductStats = async (id: string) => {
  const res = await API.get(`/products/${id}/stats`);
  return res.data;
};