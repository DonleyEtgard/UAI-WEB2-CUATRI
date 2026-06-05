import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import API from "../../services/api";

interface Sale {
  _id: string;
  customer: { name: string; lastName: string } | string;
  total: number;
  status: "paid" | "pending" | "cancelled";
  createdAt: string;
  itemsCount: number;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSales = async () => {
  try {
    setLoading(true);

    const res = await API.get("/sales");

    console.log("SALES RESPONSE:", res.data);

    const salesData =
      res.data?.data?.sales ||
      res.data?.sales ||
      res.data?.data ||
      [];

    console.log("SALES ARRAY:", salesData);

    setSales(Array.isArray(salesData) ? salesData : []);
  } catch (err) {
    console.error("Error loading sales:", err);
    setSales([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSales();
  }, []);

  // KPIs
  const totalRevenue = sales.reduce((acc, s) => acc + (s.status === 'paid' ? s.total : 0), 0);
  const pendingCount = sales.filter(s => s.status === 'pending').length;
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

  // Chart Data: Agrupar ventas por día
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: number } = {};
    
    const sortedSales = [...sales].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    sortedSales.forEach(sale => {
      const date = new Date(sale.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
      dailyData[date] = (dailyData[date] || 0) + sale.total;
    });

    return {
      categories: Object.keys(dailyData),
      series: Object.values(dailyData)
    };
  }, [sales]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "paid": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "cancelled": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default: return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Gestión de <span className="text-indigo-500">Ventas</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-2 font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            Panel Operativo de Transacciones
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/app/pos")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <span className="text-xl">🛒</span> NUEVA VENTA (POS)
          </button>
        </div>
      </div>

      {/* KPIs SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Ingresos Totales", value: `$${totalRevenue.toLocaleString()}`, color: "text-emerald-400", icon: "💰", bg: "bg-emerald-500/5" },
          { label: "Transacciones", value: sales.length, color: "text-white", icon: "📊", bg: "bg-zinc-500/5" },
          { label: "Pendientes", value: pendingCount, color: "text-amber-400", icon: "⏳", bg: "bg-amber-500/5" },
          { label: "Ticket Promedio", value: `$${averageTicket.toFixed(2)}`, color: "text-indigo-400", icon: "🎫", bg: "bg-indigo-500/5" },
        ].map((kpi, i) => (
          <div key={i} className={`relative p-6 ${kpi.bg} border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all`}>
            <div className="absolute top-0 right-0 p-4 text-2xl opacity-10 group-hover:opacity-20 transition-opacity italic">{kpi.icon}</div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{kpi.label}</p>
            <h2 className={`text-3xl font-black mt-2 ${kpi.color} tracking-tighter`}>{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* SALES TREND CHART */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8">
        <div className="mb-6">
          <h2 className="font-black text-xl text-white uppercase italic tracking-tight">Tendencia de Ingresos</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Evolución diaria de facturación</p>
        </div>
        <Chart
          options={{
            chart: { toolbar: { show: false }, background: 'transparent' },
            theme: { mode: 'dark' },
            colors: ['#6366f1'],
            stroke: { curve: 'smooth', width: 4 },
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 90, 100] } },
            xaxis: { 
              categories: chartData.categories,
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { style: { colors: '#71717a', fontWeight: 700 } }
            },
            yaxis: { labels: { style: { colors: '#71717a', fontWeight: 700 }, formatter: (val) => `$${val.toLocaleString()}` } },
            grid: { borderColor: '#27272a', strokeDashArray: 4 },
            tooltip: { theme: 'dark', y: { formatter: (val) => `$${val.toLocaleString()}` } },
            markers: { size: 5, colors: ['#6366f1'], strokeWidth: 0, hover: { size: 7 } }
          }}
          series={[{ name: 'Ventas', data: chartData.series }]}
          type="area"
          height={300}
        />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
          <div>
            <h2 className="font-black text-xl text-white uppercase italic tracking-tight">Registro de Actividad</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Historial detallado de transacciones</p>
          </div>
          <button
            onClick={loadSales}
            disabled={loading}
            className="p-3 hover:bg-zinc-800 rounded-xl transition-all text-zinc-400 hover:text-white disabled:opacity-50"
            title="Actualizar datos"
          >
            <span className={loading ? "animate-spin inline-block" : ""}>🔄</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-600 border-b border-zinc-800/50 bg-zinc-950/20 uppercase text-[9px] font-black tracking-[0.2em]">
                <th className="text-left px-8 py-5 font-medium">Referencia</th>
                <th className="text-left px-8 py-5 font-medium">Cliente</th>
                <th className="text-left px-8 py-5 font-medium">Fecha</th>
                <th className="text-left px-8 py-5 font-medium">Items</th>
                <th className="text-left px-8 py-5 font-medium">Estado</th>
                <th className="text-right px-8 py-5 font-medium">Total</th>
                <th className="text-center px-8 py-5 font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/30 font-mono">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-8 py-6"><div className="h-4 bg-zinc-800 rounded-full w-full" /></td>
                  </tr>
                ))
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-32 text-zinc-600 italic">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <span className="text-6xl">📄</span>
                      <p className="font-black uppercase tracking-widest text-xs">Sin registros de venta</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr key={s._id} className="group hover:bg-indigo-500/[0.02] transition-all">
                    <td className="px-8 py-5 whitespace-nowrap text-[10px] text-zinc-600 group-hover:text-indigo-400 transition-colors uppercase">
                      #{s._id.slice(-8)}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {typeof s.customer === "object" ? `${s.customer.name} ${s.customer.lastName}` : "Consumidor Final"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-zinc-500 text-xs">
                      {new Date(s.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-8 py-5 text-zinc-500 text-xs font-bold">
                      {s.itemsCount || 0} pzs
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-tighter ${getStatusStyle(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-white font-black text-base tracking-tighter">
                        ${s.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <button
                        onClick={() => navigate(`/app/sales/${s._id}`)}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;