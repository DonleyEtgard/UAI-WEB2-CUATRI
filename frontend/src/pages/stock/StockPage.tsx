import { useEffect, useState } from "react";
import { getStockMovements } from "../../services/stock.service";
import type { StockMovement } from "../../services/stock.service";

const StockPage = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getStockMovements();
      setMovements(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Cargando movimientos...</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Stock Movements
      </h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2">Product</th>
            <th className="p-2">Type</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Stock After</th>
          </tr>
        </thead>

        <tbody>
          {movements.map((m) => (
            <tr key={m._id} className="border-t">
              <td className="p-2">
                {m.product?.name || m.product}
              </td>

              <td className="p-2">
                {m.type === "in" ? "IN 📈" : "OUT 📉"}
              </td>

              <td className="p-2">{m.quantity}</td>

              <td className="p-2">{m.reason}</td>

              <td className="p-2">{m.stockAfter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockPage;