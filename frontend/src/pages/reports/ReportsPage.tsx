import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import API from "../../services/api";

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const res = await API.get("/sales/summary");

        setData(res.data.data);
      } catch (err) {
        console.error("Error loading reports:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium tracking-widest uppercase text-[10px]">Generando reportes...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Panel de Venta <span className="text-indigo-500"></span>
          </h1>
          <p className="text-xs text-zinc-500 mt-2 font-black tracking-[0.3em] uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Dashboard de Rendimiento Comercial
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Última actualización</p>
          <p className="text-sm font-mono text-zinc-400">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* KPIs SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Ingresos Totales", value: `$${data.revenue.toLocaleString()}`, color: "text-emerald-400", icon: "💰", trend: "+12.5%" },
          { label: "Volumen de Ventas", value: data.salesCount, color: "text-white", icon: "📈", trend: "Estable" },
          { label: "Ticket Promedio", value: `$${data.avgTicket.toLocaleString()}`, color: "text-indigo-400", icon: "🎫", trend: "+4.2%" },
        ].map((kpi, i) => (
          <div key={i} className="relative p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="absolute top-0 right-0 p-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity italic">{kpi.icon}</div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{kpi.label}</p>
            <div className="flex items-baseline gap-3 mt-2">
              <h2 className={`text-3xl font-black ${kpi.color} tracking-tighter`}>{kpi.value}</h2>
              <span className="text-[10px] font-bold text-zinc-600 italic">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* GRÁFICO - Visualización Pro */}
        <div className="lg:col-span-3 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-8">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="font-black text-xl text-white uppercase italic tracking-tight">Top Performance</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Distribución por Volumen</p>
            </div>
          </div>
          
          <Chart
            options={{
              chart: { toolbar: { show: false }, background: 'transparent' },
              theme: { mode: 'dark' },
              colors: ['#6366f1'],
              plotOptions: { bar: { borderRadius: 8, horizontal: true, barHeight: '40%' } },
              dataLabels: { enabled: false },
              xaxis: { 
                categories: data.topProducts?.map((p: any) => p._id.split(' ')[0]) || [],
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { style: { colors: '#71717a', fontWeight: 700 } }
              },
              grid: { borderColor: '#27272a', strokeDashArray: 4 },
              tooltip: { theme: 'dark' }
            }}
            series={[{ name: 'Unidades', data: data.topProducts?.map((p: any) => p.quantity) || [] }]}
            type="bar"
            height={300}
          />
        </div>

        {/* TABLA - Detalle Técnico */}
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-8 border-b border-zinc-800 bg-zinc-900/20">
            <h2 className="font-black text-xl text-white uppercase italic tracking-tight">Ranking</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Desglose Técnico de Unidades</p>
          </div>
          <div className="overflow-y-auto flex-1 max-h-[350px] scrollbar-thin scrollbar-thumb-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-600 border-b border-zinc-800/50 bg-zinc-950/20 uppercase text-[9px] font-black tracking-[0.25em]">
                  <th className="text-left px-8 py-4">Ítem</th>
                  <th className="text-right px-8 py-4">Qtd</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30 font-mono">
                {data.topProducts?.map((product: any, i: number) => (
                  <tr
                    key={i}
                    className="group hover:bg-zinc-800/20 transition-all"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-zinc-700 font-black">0{i+1}</span>
                        <span className="text-zinc-300 font-bold group-hover:text-indigo-400 transition-colors uppercase truncate max-w-[120px]">
                          {product._id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="bg-zinc-800 px-2 py-1 rounded text-[11px] text-white font-black group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
                        {product.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.topProducts?.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-8 py-10 text-center text-zinc-600 italic text-xs">
                      Sin datos de movimiento
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;