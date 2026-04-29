import { useState } from "react";
import {
  createSale,
  getSaleItems,
  getSaleItemById,
  getItemsBySale,
  deleteSaleItem,
  getTicket
} from "./api";


// ==========================
// 🧾 TYPES
// ==========================

type SaleItemType = {
  product: string;
  quantity: number;
};

type CreateSaleData = {
  customer?: string;
  user: string;
  paymentMethod: "cash" | "card" | "transfer";
  items: SaleItemType[];
  amountPaid?: number;
  notes?: string;
};


// ==========================
// 🛒 HOOK
// ==========================

export const useSales = () => {
  const [sale, setSale] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [ticket, setTicket] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🛒 CREAR VENTA
  const createNewSale = async (data: CreateSaleData) => {
    try {
      setError(null);
      setLoading(true);

      const res = await createSale(data);
      setSale(res.sale);

      return res;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📦 TODOS LOS ITEMS
  const loadSaleItems = async () => {
    try {
      setError(null);
      setLoading(true);

      const data = await getSaleItems();
      setItems(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 📦 ITEMS POR VENTA
  const loadItemsBySale = async (saleId: string) => {
    try {
      setError(null);
      setLoading(true);

      const data = await getItemsBySale(saleId);
      setItems(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 ITEM POR ID
  const loadSaleItemById = async (id: string) => {
    try {
      setError(null);
      setLoading(true);

      return await getSaleItemById(id);

    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ❌ ELIMINAR ITEM
  const removeSaleItem = async (id: string) => {
    try {
      setError(null);
      setLoading(true);

      await deleteSaleItem(id);
      await loadSaleItems();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧾 TICKET
  const loadTicket = async (saleId: string) => {
    try {
      setError(null);
      setLoading(true);

      const data = await getTicket(saleId);
      setTicket(data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧹 RESET (muy útil en POS)
  const resetSale = () => {
    setSale(null);
    setItems([]);
    setTicket(null);
    setError(null);
  };

  return {
    // state
    sale,
    items,
    ticket,
    loading,
    error,

    // actions
    createNewSale,
    loadSaleItems,
    loadItemsBySale,
    loadSaleItemById,
    removeSaleItem,
    loadTicket,
    resetSale
  };
};