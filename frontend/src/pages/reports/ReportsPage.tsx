import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import UnifiedSearchFilter from "../../components/dashboard/UnifiedSearchFilter";

// ============================================================================
// TYPES
// ============================================================================

type Sale = {
  _id: string;
  customer?: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
};

const ReportsPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
  });


  const loadSales = async () => {
    try {
      setLoading(true);

      const response = await API.get<Sale[]>("/sales");

      // Si tu backend devuelve { data: [...] } usa response.data.data
      // Si devuelve [...] usa response.data directamente
      const salesData = Array.isArray(response.data) ? response.data : [];

      setSales(salesData);
    } catch (error) {
      console.error("Error loading sales reports:", error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  useEffect(() => {
    loadSales();
  }, []);

  // ==========================================================================
  // FILTERED SALES
  // ==========================================================================

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const customer = sale.customer?.toLowerCase() || "";
      const payment = sale.paymentMethod?.toLowerCase() || "";
      const query = filters.searchQuery.toLowerCase();
      const saleDate = new Date(sale.createdAt);

      // Búsqueda por texto (Nombre, Pago o ID)
      const matchesSearch = 
        customer.includes(query) ||
        payment.includes(query) ||
        sale._id.toLowerCase().includes(query);

      // Filtro por rango de fechas
      let matchesDate = true;
      if (filters.dateFrom) {
        matchesDate = matchesDate && saleDate >= new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        const endDate = new Date(new Date(filters.dateTo).setHours(23, 59, 59, 999));
        matchesDate = matchesDate && saleDate <= endDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [sales, filters]);

  // ==========================================================================
  // KPI
  // ==========================================================================

  const totalRevenue = filteredSales.reduce(
    (acc, sale) => acc + sale.total,
    0
  );

  const totalSales = filteredSales.length;

  const avgTicket = totalSales
    ? totalRevenue / totalSales
    : 0;

  const cashSales = filteredSales.filter(
    (sale) => sale.paymentMethod === "cash"
  ).length;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Sales Reports
          </h1>

          <p className="text-slate-500 mt-1">
            Analyze sales performance and revenue
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition">
          Export Report
        </button>
      </div>

      {/* FILTROS DE BÚSQUEDA AVANZADOS */}
      <UnifiedSearchFilter onSearch={setFilters} />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <p className="text-slate-500 text-sm">
            Total Sales
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {totalSales}
          </h2>
        </div>

        <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-5">
          <p className="text-green-700 text-sm">
            Revenue
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            ${totalRevenue.toFixed(2)}
          </h2>
        </div>

        <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 p-5">
          <p className="text-blue-700 text-sm">
            Avg Ticket
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            ${avgTicket.toFixed(2)}
          </h2>
        </div>

        <div className="bg-orange-50 rounded-2xl shadow-sm border border-orange-100 p-5">
          <p className="text-orange-700 text-sm">
            Cash Payments
          </p>

          <h2 className="text-3xl font-bold text-orange-700 mt-2">
            {cashSales}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Sales Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest registered sales
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading reports...
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No sales found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4">Sale ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                {filteredSales.map((sale) => (
                  <tr
                    key={sale._id}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">
                      #{sale._id.slice(-6)}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {sale.customer || "Walk-in Customer"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                        {sale.paymentMethod}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-slate-800">
                      ${sale.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
