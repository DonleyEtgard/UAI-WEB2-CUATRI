import { useEffect, useState } from "react";
import { getSaleItems } from "./api"; // 🔥 ajusta ruta si hace falta

type SaleItem = {
  _id: string;
  quantity: number;
  subtotal: number;
  createdAt: string;
};

const SalesStats = () => {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 📦 cargar items
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getSaleItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 💰 total revenue
  const totalRevenue = items.reduce((sum, i) => sum + i.subtotal, 0);

  // 📦 total productos vendidos
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // 📅 ventas por día
  const salesByDay = items.reduce((acc: any, item) => {
    const date = new Date(item.createdAt).toLocaleDateString();

    if (!acc[date]) {
      acc[date] = 0;
    }

    acc[date] += item.subtotal;

    return acc;
  }, {});

  if (loading) return <p>Loading stats...</p>;

  return (
    <div className="p-4">

      <h2 className="text-2xl font-bold mb-4">📊 Sales Stats</h2>

      {/* 🔹 KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h3 className="text-xl font-bold">${totalRevenue}</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Items Sold</p>
          <h3 className="text-xl font-bold">{totalItems}</h3>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Transactions</p>
          <h3 className="text-xl font-bold">{items.length}</h3>
        </div>

      </div>

      {/* 📅 Ventas por día */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Ventas por día</h3>

        {Object.entries(salesByDay).map(([date, total]) => (
          <div key={date} className="flex justify-between border-b py-1">
            <span>{date}</span>
            <span>${total as number}</span>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-gray-500">No hay datos</p>
        )}
      </div>

    </div>
  );
};

export default SalesStats;