import { getWithCache, requestOrQueue } from "./offlineApi";
// ==========================
// TYPES
// ==========================

export type Currency = "HTG" | "$ ARG";

export type Category = {
  _id: string;
  name: string;
  slug?: string;
  isActive?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  user: string;
  description?: string;

  price: number;
  cost: number;

  stock: number;
  category?: string | Category;

  images?: string[];
  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
};

export type ProductStats = {
  product: Product;
  stats: {
    stock: number;
    totalSold: number;
    totalRevenue: number;
    profit: number;
  };
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
  if (!id || id === "undefined") throw new Error("Product ID is required");
  return await getWithCache<Product>(`/products/${id}`);
};

// ➕ CREATE
export const createProduct = async (
  productData: Omit<Product, "_id" | "isActive" | "createdAt" | "updatedAt" | "images"> & {
    images?: (File | string)[];
  }
): Promise<Product> => {
  const { images, ...restData } = productData as any;

  const formData = new FormData();
  Object.entries(restData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value as string);
    }
  });

  const existingImageUrls: string[] = [];
  const newImageFiles: File[] = [];

  if (images) {
    images.forEach((img: string | File) => {
      if (typeof img === "string") {
        existingImageUrls.push(img);
      } else {
        newImageFiles.push(img);
      }
    });
  }

  formData.append("imageUrls", JSON.stringify(existingImageUrls));
  newImageFiles.forEach((file) => {
    formData.append("images", file);
  });

  // Fallback para creación offline
  const fallbackProduct: Product = {
    ...(productData as Omit<Product, "_id">),
    _id: `off_${Date.now()}`, // Generar un ID temporal para el modo offline
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // requestOrQueue debe poder manejar FormData
  return await requestOrQueue<Product>(
    "POST",
    "/products",
    formData,
    fallbackProduct
  );
};

// ✏️ UPDATE
export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, "_id">> & {
    images?: (File | string)[];
    imageUrls?: string[];
  }
): Promise<Product> => {
  if (!id || id === "undefined") throw new Error("Product ID is required");

  const formData = new FormData();
  for (const key in productData) {
    const value = (productData as any)[key];
    if (key === "images") {
      (value as File[]).forEach((file) => {
        if (file instanceof File) {
          formData.append("images", file);
        }
      });
    } else if (key === "imageUrls") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  return await requestOrQueue<Product>("PUT", `/products/${id}`, formData);
};

// ❌ DELETE
export const deleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  if (!id || id === "undefined") throw new Error("Product ID is required");
  return await requestOrQueue<{ message: string }>("DELETE", `/products/${id}`);
};

// 📦 STOCK
export const updateStock = async (
  id: string,
  quantity: number
): Promise<Product> => {
  if (!id || id === "undefined") throw new Error("Product ID is required");
  // Fallback para actualización de stock offline
  const fallbackStockUpdate: Partial<Product> = {
    stock: quantity,
    updatedAt: new Date().toISOString(),
  };
  return await requestOrQueue<Product>(
    "PATCH",
    `/products/${id}/stock`,
    { quantity },
    fallbackStockUpdate as Product
  );
};

// 📊 STATS
export const getProductStats = async (
  id: string
): Promise<ProductStats> => {
  if (!id || id === "undefined") throw new Error("Product ID is required");
  return await getWithCache<ProductStats>(`/products/${id}/stats`);
};