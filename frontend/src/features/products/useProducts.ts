import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} from "./api";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const addProduct = async (data: any) => {
    await createProduct(data);
    await loadProducts();
  };

  const editProduct = async (id: string, data: any) => {
    await updateProduct(id, data);
    await loadProducts();
  };

  const removeProduct = async (id: string) => {
    await deleteProduct(id);
    await loadProducts();
  };

  const changeStock = async (id: string, quantity: number) => {
    await updateStock(id, quantity);
    await loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    editProduct,
    removeProduct,
    changeStock
  };
};  