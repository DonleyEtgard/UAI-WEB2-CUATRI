import { useState, useEffect, useCallback } from "react";
import {
  fetchStockMovements,
  fetchMovementsByProduct,
  fetchStockMovementById,
  createStockMovementAction,
  fetchStockSummary,
} from "./api";
import type { StockMovement, CreateStockMovement } from "./types";

// ============================================================================
// HOOK: useStockMovements (Historial completo)
// ============================================================================
export const useStockMovements = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStockMovements();
      setMovements(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar movimientos de stock.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { movements, loading, error, reload };
};

// ============================================================================
// HOOK: useProductMovements (Filtrado por producto específico)
// ============================================================================
export const useProductMovements = (productId?: string) => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMovementsByProduct(productId);
      setMovements(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar movimientos del producto.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { movements, loading, error, reload };
};

// ============================================================================
// HOOK: useStockMovement (Detalle individual)
// ============================================================================
export const useStockMovement = (id?: string) => {
  const [movement, setMovement] = useState<StockMovement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStockMovementById(id);
      setMovement(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el detalle del movimiento.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { movement, loading, error, reload };
};

// ============================================================================
// HOOK: useCreateStockMovement (Acción de inserción / Ajuste manual)
// ============================================================================
export const useCreateStockMovement = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreate = async (data: CreateStockMovement) => {
    try {
      setLoading(true);
      return await createStockMovementAction(data);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreate, loading };
};

// ============================================================================
// HOOK: useStockSummary (Métricas del tablero de control / Kpis)
// ============================================================================
export const useStockSummary = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reload = async () => {
    setLoading(true);
    try { const data = await fetchStockSummary(); setSummary(data); } finally { setLoading(false); }
  };

  return { summary, loading, reload };
};