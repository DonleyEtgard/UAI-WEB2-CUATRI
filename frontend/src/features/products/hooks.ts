import { 
  useEffect, 
  useState, 
  useCallback 
} from "react";
import {
  fetchProducts,
  fetchProductById,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  updateStockAction,
  fetchProductStats,
} from "./api";
import type { Product, ProductStats } from "./types";

// ============================================================================
// HOOK: useProducts
// ============================================================================
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Error loading products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    products,
    loading,
    error,
    reload,
  };
};

// ============================================================================
// HOOK: useProduct
// ============================================================================
export const useProduct = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductById(id);
      setProduct(data);
    } catch (err: any) {
      setError(err.message || "Error loading product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    product,
    loading,
    error,
    reload,
  };
};

// ============================================================================
// HOOK: useCreateProduct
// ============================================================================
export const useCreateProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async (data: Omit<Product, "_id" | "isActive">) => {
    try {
      setLoading(true);
      return await createProductAction(data);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreate, loading };
};

// ============================================================================
// HOOK: useUpdateProduct
// ============================================================================
export const useUpdateProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = async (id: string, data: Partial<Product>) => {
    try {
      setLoading(true);
      return await updateProductAction(id, data);
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading };
};

// ============================================================================
// HOOK: useDeleteProduct
// ============================================================================
export const useDeleteProduct = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      return await deleteProductAction(id);
    } finally {
      setLoading(false);
    }
  };

  return { handleDelete, loading };
};

// ============================================================================
// HOOK: useUpdateStock
// ============================================================================
export const useUpdateStock = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdateStock = async (id: string, quantity: number) => {
    try {
      setLoading(true);
      return await updateStockAction(id, quantity);
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateStock, loading };
};

// ============================================================================
// HOOK: useProductStats
// ============================================================================
export const useProductStats = (id?: string) => {
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reload = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchProductStats(id);
      setStats(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { stats, loading, reload };
};