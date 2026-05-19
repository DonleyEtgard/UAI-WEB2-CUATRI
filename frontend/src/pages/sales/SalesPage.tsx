import { useEffect, useState } from "react";
import API from "../../services/api";

type Sale = {
  _id: string;
  customer?: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
};

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // 📦 LOAD SALES
  // ==========================
  const loadSales = async () => {
    setLoading(true);
    try {
      const res = await API.get<Sale[]>("/sales");
      setSales(res.data ?? []);
    } catch (err) {
      console.error("Error loading sales:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // 🚀 EFFECT
  // ==========================
  useEffect(() => {
    loadSales();
  }, []);

  // ==========================
  // 📊 KPI
  // ==========================
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const avgTicket = sales.length ? totalRevenue / sales.length : 0;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales</h1>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          + New Sale
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Sales</p>
          <p className="text-xl font-bold">{sales.length}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl shadow">
          <p className="text-green-700">Revenue</p>
          <p className="text-xl font-bold">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl shadow">
          <p className="text-blue-700">Avg Ticket</p>
          <p className="text-xl font-bold">
            ${avgTicket.toFixed(2)}
          </p>
        </div>

      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-gray-500">
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="border-t hover:bg-gray-50">

                    <td className="p-3">
                      {sale.customer ?? "N/A"}
                    </td>

                    <td className="p-3 font-medium">
                      ${sale.total}
                    </td>

                    <td className="p-3">
                      {sale.paymentMethod}
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};

export default SalesPage;