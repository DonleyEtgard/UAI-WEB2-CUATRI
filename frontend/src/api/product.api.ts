const BASE_URL = "http://localhost:3000/api";

// 🔧 helper reutilizable
const request = async (endpoint: string, options: RequestInit = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};


// ==========================
// 📦 PRODUCTS API
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

// 🔄 GET ALL
export const getProducts = async (): Promise<Product[]> => {
  return request("/products");
};

// 🔍 GET ONE
export const getProductById = async (id: string): Promise<Product> => {
  return request(`/products/${id}`);
};

// ➕ CREATE
export const createProduct = async (
  data: Omit<Product, "_id" | "isActive">
): Promise<Product> => {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

// ✏️ UPDATE
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  return request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

// ❌ DELETE (soft delete)
export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  return request(`/products/${id}`, {
    method: "DELETE"
  });
};

// 📦 UPDATE STOCK
export const updateStock = async (
  id: string,
  quantity: number
): Promise<Product> => {
  return request(`/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ quantity })
  });
};

// 📊 STATS
export const getProductStats = async (id: string) => {
  return request(`/products/${id}/stats`);
};