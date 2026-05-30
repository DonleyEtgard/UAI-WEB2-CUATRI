import { useEffect, useState } from "react";
import { getStockSummary } from "../../services/stock.service.ts";

export default function StockSummaryPanel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getStockSummary();
      setData(res);
    };

    load();
  }, []);

  if (!data) return <div className="text-center p-4 text-muted">Cargando resumen...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="flex flex-col p-2">
        <span className="text-xs font-bold uppercase text-gray-400">Total Ingresos</span>
        <span className="text-2xl font-bold text-green-600">+{data.totalIn}</span>
      </div>

      <div className="flex flex-col p-2">
        <span className="text-xs font-bold uppercase text-gray-400">Total Salidas</span>
        <span className="text-2xl font-bold text-red-600">-{data.totalOut}</span>
      </div>

      <div className="flex flex-col p-2">
        <span className="text-xs font-bold uppercase text-gray-400">Balance Neto</span>
        <span className={`text-2xl font-bold ${data.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{data.balance}</span>
      </div>
    </div>
  );
}