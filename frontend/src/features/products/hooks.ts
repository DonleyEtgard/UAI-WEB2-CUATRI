import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getProductStats
} from "./api";

type Product = {
  _id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  description?: string;
  category?: string;
  isActive: boolean;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [stats, setStats] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 CARGAR PRODUCTOS
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREAR
  const addProduct = async (data: Omit<Product, "_id" | "isActive">) => {
    try {
      setLoading(true);
      await createProduct(data);
      await loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ EDITAR
  const editProduct = async (id: string, data: Partial<Product>) => {
    try {
      setLoading(true);
      await updateProduct(id, data);
      await loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ❌ ELIMINAR (soft delete)
  const removeProduct = async (id: string) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      await loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📦 ACTUALIZAR STOCK
  const changeStock = async (id: string, quantity: number) => {
    try {
      setLoading(true);
      await updateStock(id, quantity);
      await loadProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📊 STATS
  const loadStats = async (id: string) => {
    try {
      setLoading(true);
      const data = await getProductStats(id);
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 INIT
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    selectedProduct,
    setSelectedProduct,

    stats,

    loading,
    error,

    loadProducts,
    addProduct,
    editProduct,
    removeProduct,
    changeStock,
    loadStats
  };
};