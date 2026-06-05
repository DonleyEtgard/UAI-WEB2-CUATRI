import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import StockFilterForm from "./StockFilterForm";
import StockSummaryPanel from "./StockSummaryPanel";

import {
  getStockMovements,
  getMovementsByProduct,
} from "../../services/stock.service";

import { LineChartComponent } from "../../components/dashboard/LineChartComponent";

export default function StockMovement() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // LOAD DATA
  // =========================
  const loadMovements = async (productId?: string) => {
    try {
      setLoading(true);

      const data = productId
        ? await getMovementsByProduct(productId)
        : await getStockMovements();

      setMovements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading stock movements:", error);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const handleFilter = (productId?: string) => {
    loadMovements(productId);
  };

  const handleNewStock = () => {
    navigate("/app/stock/movement/new");
  };

  // =========================
  // KPIs
  // =========================
  const totalEntries = useMemo(
    () =>
      movements
        .filter((m) => m.type === "in")
        .reduce((acc, m) => acc + Number(m.quantity || 0), 0),
    [movements]
  );

  const totalExits = useMemo(
    () =>
      movements
        .filter((m) => m.type === "out")
        .reduce((acc, m) => acc + Number(m.quantity || 0), 0),
    [movements]
  );

  const netBalance = totalEntries - totalExits;

  const todayMovements = useMemo(() => {
    const today = new Date().toDateString();
    return movements.filter(
      (m) => new Date(m.createdAt).toDateString() === today
    ).length;
  }, [movements]);

  // =========================
  // CHART
  // =========================
  const chartData = useMemo(() => {
    if (!movements.length) return [];

    return movements.reduce((acc: any[], mov: any) => {
      if (!mov.createdAt) return acc;

      const date = new Date(mov.createdAt).toLocaleDateString();

      const existing = acc.find((x) => x.date === date);

      if (existing) {
        if (mov.type === "in") existing.in += Number(mov.quantity || 0);
        else existing.out += Number(mov.quantity || 0);
      } else {
        acc.push({
          date,
          in: mov.type === "in" ? Number(mov.quantity || 0) : 0,
          out: mov.type === "out" ? Number(mov.quantity || 0) : 0,
        });
      }

      return acc;
    }, []);
  }, [movements]);

  const stockTrendData = useMemo(() => {
    if (!chartData.length) {
      return {
        categories: ["Sin datos"],
        series: [
          { name: "Ingresos", data: [0] },
          { name: "Salidas", data: [0] },
        ],
      };
    }

    return {
      categories: chartData.map((c) => c.date),
      series: [
        { name: "Ingresos", data: chartData.map((c) => c.in) },
        { name: "Salidas", data: chartData.map((c) => c.out) },
      ],
    };
  }, [chartData]);

  // =========================
  // UI
  // =========================
  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f1115] text-white">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">

        <div>
          <h1 className="text-2xl font-bold">📦 Stock Movement</h1>
          <p className="text-sm text-gray-400">
            Gestión de entradas y salidas de inventario
          </p>
        </div>
      </div>

      {/* FILTER (ARRIBA COMO PEDISTE) */} 
      <div className="bg-gray-900 p-4 rounded-lg"> 
           <StockFilterForm onFilter={handleFilter} 
             onReload={loadMovements} /> 
        </div>

      {/* KPI ROW (UNA SOLA FILA + BALANCE) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">Entradas</p>
          <h2 className="text-xl text-green-400 font-bold">{totalEntries}</h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">Salidas</p>
          <h2 className="text-xl text-red-400 font-bold">{totalExits}</h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">Hoy</p>
          <h2 className="text-xl text-blue-400 font-bold">{todayMovements}</h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">Balance Neto</p>
          <h2 className={`text-xl font-bold ${netBalance >= 0 ? "text-green-400" : "text-red-400"}`}>
            {netBalance}
          </h2>
        </div>

      </div>

      {/* SUMMARY */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <StockSummaryPanel />
      </div>

      {/* BUTTON SOLO (SIN FORM) */}
      <div className="flex justify-end">
        <button
          onClick={handleNewStock}
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700"
        >
          ➕ Registrar movimiento
        </button>
      </div>

      {/* CHART */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <LineChartComponent
          title="📊 Tendencia de Stock"
          series={stockTrendData.series}
          categories={stockTrendData.categories}
        />
      </div>

      {/* TABLE */}
      <div className="bg-gray-900 p-4 rounded-lg">

        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">📋 Movimientos</h2>

          <button
            onClick={() => loadMovements()}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
          >
            Recargar
          </button>
        </div>

        {loading ? (
          <div className="text-gray-400 text-center py-10">
            Cargando...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 border-b border-gray-700">
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {movements.map((m, i) => (
                  <tr key={m._id || i} className="border-b border-gray-800">
                    <td>{m?.product?.name || m.productId}</td>
                    <td className={m.type === "in" ? "text-green-400" : "text-red-400"}>
                      {m.type}
                    </td>
                    <td>{m.quantity}</td>
                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}