import { useState, useEffect, useCallback } from "react";
import {
  fetchSales,
  createSaleAction,
  fetchSaleItems,
  fetchSaleItemById,
  fetchItemsBySale,
  deleteSaleItemAction,
  fetchTicket,
  sendTicketWhatsAppAction,
  sendTicketTelegramAction,
} from "./api";
import type { Sale, SaleItem, CreateSaleData, TicketInfo } from "./types";

// ============================================================================
// HOOK: useSales (Obtener todas las facturas de venta)
// ============================================================================
export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSales();
      setSales(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar ventas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { sales, loading, error, reload };
};

// ============================================================================
// HOOK: useSaleItems (Obtener ítems de venta)
// ============================================================================
export const useSaleItems = () => {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSaleItems();
      setSaleItems(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar ítems de venta.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { saleItems, loading, error, reload };
};

// ============================================================================
// HOOK: useSaleItem (Obtener un ítem de venta por ID)
// ============================================================================
export const useSaleItem = (id?: string) => {
  const [saleItem, setSaleItem] = useState<SaleItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSaleItemById(id);
      setSaleItem(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el ítem de venta.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { saleItem, loading, error, reload };
};

// ============================================================================
// HOOK: useItemsBySale (Obtener ítems de venta por ID de venta)
// ============================================================================
export const useItemsBySale = (saleId?: string) => {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!saleId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItemsBySale(saleId);
      setItems(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los ítems de la venta.");
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { items, loading, error, reload };
};

// ============================================================================
// HOOK: useCreateSale (Crear una nueva venta)
// ============================================================================
export const useCreateSale = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(async (data: CreateSaleData) => {
    setLoading(true);
    setError(null);
    try {
      const newSale = await createSaleAction(data);
      return newSale;
    } catch (err: any) {
      setError(err.message || "Error al crear la venta.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleCreate, loading, error };
};

// ============================================================================
// HOOK: useDeleteSaleItem (Eliminar un ítem de venta)
// ============================================================================
export const useDeleteSaleItem = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSaleItemAction(id);
    } catch (err: any) {
      setError(err.message || "Error al eliminar el ítem de venta.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleDelete, loading, error };
};

// ============================================================================
// HOOK: useTicket (Obtener información de un ticket de venta)
// ============================================================================
export const useTicket = (saleId?: string) => {
  const [ticket, setTicket] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!saleId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTicket(saleId);
      setTicket(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el ticket.");
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ticket, loading, error, reload };
};

// ============================================================================
// HOOK: useSendTicketWhatsApp (Enviar ticket por WhatsApp)
// ============================================================================
export const useSendTicketWhatsApp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (saleId: string, phone: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendTicketWhatsAppAction(saleId, phone);
      return { success: true };
    } catch (err: any) {
      setError(err.message || "Error al enviar el ticket por WhatsApp.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { send, loading, error };
};

// ============================================================================
// HOOK: useSendTicketTelegram (Enviar ticket por Telegram)
// ============================================================================
export const useSendTicketTelegram = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (saleId: string) => {
    setLoading(true);
    setError(null);
    try {
      await sendTicketTelegramAction(saleId);
      return { success: true };
    } catch (err: any) {
      setError(err.message || "Error al enviar el ticket por Telegram.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { send, loading, error };
};