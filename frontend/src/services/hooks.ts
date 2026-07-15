import { useState, useEffect, useCallback } from "react";
import { getSalesSummary } from "./sales.service";
import { getStockSummary as fetchStockStatus } from "./stock.service";
import type { SalesSummary, StockReport } from "./types";

// ============================================================================
// HOOK: useSalesReport
// ============================================================================
export const useSalesReport = (startDate?: string, endDate?: string) => {
  const [data, setData] = useState<SalesSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getSalesSummary(startDate, endDate);
      setData(summary);
    } catch (err: any) {
      setError(err.message || "Error al cargar reporte de ventas");
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
};

// ============================================================================
// HOOK: useStockReport
// ============================================================================
export const useStockReport = () => {
  const [data, setData] = useState<StockReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await fetchStockStatus();
      setData(report);
    } catch (err: any) {
      setError(err.message || "Error al cargar reporte de inventario");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
};