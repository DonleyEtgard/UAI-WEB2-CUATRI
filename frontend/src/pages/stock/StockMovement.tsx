import { useEffect, useState } from "react";

import StockMovementForm from "./StockMovementForm";
import StockFilterForm from "./StockFilterForm";
import StockSummaryPanel from "./StockSummaryPanel";

import {
  getStockMovements,
  getMovementsByProduct,
} from "../../services/stock.service.ts";

export default function StockMovement() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 📦 cargar datos
  const loadMovements = async (productId?: string) => {
    try {
      setLoading(true);

      const data = productId
        ? await getMovementsByProduct(productId)
        : await getStockMovements();

      setMovements(data);
    } catch (error) {
      console.error("Error loading stock movements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  // 🔎 filtro
  const handleFilter = (productId?: string) => {
    loadMovements(productId);
  };

  // 📊 data para gráfico
  const chartData = movements.reduce((acc: any[], mov: any) => {
    const date = new Date(mov.createdAt).toLocaleDateString();

    const existing = acc.find((x) => x.date === date);

    if (existing) {
      if (mov.type === "in") existing.in += mov.quantity;
      else existing.out += mov.quantity;
    } else {
      acc.push({
        date,
        in: mov.type === "in" ? mov.quantity : 0,
        out: mov.type === "out" ? mov.quantity : 0,
      });
    }

    return acc;
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen fade-in-up">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          📦 Stock Movement
        </h1>
        <p className="text-muted-xs text-sm">
          Gestión de entradas y salidas de inventario
        </p>
      </div>

      {/* SUMMARY */}
      <div className="card">
        <StockSummaryPanel />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">
            ➕ Nuevo movimiento
          </h2>
          <StockMovementForm />
        </div>

        {/* FILTER */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">
            🔎 Filtros
          </h2>
          <StockFilterForm onFilter={handleFilter} />
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4">
          📋 Movimientos de stock
        </h2>

        {loading ? (
          <div className="p-10 text-center text-muted">Cargando movimientos...</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Razón</th>
                  <th>Stock After</th>
                  <th>Fecha</th>
                </tr>
              </thead>

              <tbody>
                {movements.map((m: any, i: number) => (
                  <tr
                    key={m.id || m._id || i}
                    className="hover:bg-gray-50"
                  >
                    <td className="font-medium text-primary">
                      {m.productId || m.product?._id}
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          m.type === "in"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>

                    <td className="font-bold">
                      {m.quantity}
                    </td>

                    <td className="text-muted-xs capitalize">
                      {m.reason}
                    </td>

                    <td className="font-mono">
                      {m.stockAfter ?? "-"}
                    </td>

                    <td className="text-muted-xs">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHART */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          📊 Tendencia de stock
        </h2>

        <div className="h-72 flex items-center justify-center text-gray-400">
          <pre className="text-xs overflow-auto w-full">
            {JSON.stringify(
              {
                chartType: "line",
                meta: {
                  title: "Stock In vs Out",
                  description: "Movimiento diario de inventario",
                },
                xKey: "date",
                series: [
                  {
                    dataKey: "in",
                    label: "Ingresos",
                    valueFormat: "integer",
                  },
                  {
                    dataKey: "out",
                    label: "Salidas",
                    valueFormat: "integer",
                  },
                ],
                data: chartData,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}