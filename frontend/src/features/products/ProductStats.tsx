import { useEffect, useState } from "react";
import { getProductStats } from "./api";

type Props = {
  productId: string;
  onClose?: () => void;
};

const ProductStats = ({ productId, onClose }: Props) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, [productId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await getProductStats(productId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading stats...</div>;
  }

  if (!data) {
    return <div className="p-6">Pas de donnee</div>;
  }

  const { product, stats } = data;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Product Stats</h2>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="mb-6">
        <p className="text-lg font-semibold">{product.name}</p>
        <p className="text-sm text-gray-500">
          Price: ${product.price} | Cost: ${product.cost}
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Stock" value={stats.stock} />
        <StatCard title="Sold Units" value={stats.totalSold} />
        <StatCard title="Revenue" value={`$${stats.totalRevenue}`} />
        <StatCard title="Profit" value={`$${stats.profit}`} />
      </div>

      {/* EXTRA INFO */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Category: {product.category || "-"}</p>
        <p>Description: {product.description || "-"}</p>
      </div>
    </div>
  );
};

export default ProductStats;

// 🔹 Componente reutilizable
const StatCard = ({ title, value }: any) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
};