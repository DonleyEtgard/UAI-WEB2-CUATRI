import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Movement {
  _id: string;
  productId: { name: string; sku: string };
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  user: { name: string; lastName: string };
  createdAt: string;
}

const StockMovement = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  const loadMovements = async () => {
    try {
      setLoading(true);
      const res = await API.get("/stock/movements");
      setMovements(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error loading movements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const filteredMovements = movements.filter((m) => 
    filter === "all" ? true : m.type === filter
  );

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "in": return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "↑" };
      case "out": return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: "↓" };
      default: return { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "±" };
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Movimientos de Stock</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-widest font-bold">Auditoría de Inventario</p>
        </div>
        <button
          onClick={() => navigate("/app/stock/new")}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          Registrar Ajuste
        </button>
      </div>

      {/* Filters Segmented Control */}
      <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-2xl w-fit">
        {["all", "in", "out", "adjustment"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === t 
                ? "bg-zinc-800 text-white shadow-lg" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t === "all" ? "Todos" : t === "in" ? "Entradas" : t === "out" ? "Salidas" : "Ajustes"}
          </button>
        ))}
      </div>

      <div className="relative">
        {/* Timeline Vertical Line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-zinc-800 hidden sm:block"></div>

        <div className="space-y-8 relative">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-6 animate-pulse">
                <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0"></div>
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-4 bg-zinc-900 rounded w-1/4"></div>
                  <div className="h-3 bg-zinc-900 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : filteredMovements.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl">
              <p className="text-zinc-500 font-medium">No se encontraron movimientos con estos filtros.</p>
            </div>
          ) : (
            filteredMovements.map((m) => {
              const style = getTypeStyles(m.type);
              return (
                <div key={m._id} className="group flex flex-col sm:flex-row gap-6">
                  {/* Icon Node */}
                  <div className={`relative z-10 h-14 w-14 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center text-xl font-black ${style.color} shadow-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                    {style.icon}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] hover:border-zinc-700 transition-colors shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white tracking-tight">
                            {m.productId?.name || "Producto desconocido"}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                            {m.productId?.sku}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed italic">
                          "{m.reason || "Sin descripción proporcionada"}"
                        </p>
                      </div>

                      <div className="text-right flex flex-col justify-center gap-1">
                        <div className={`text-2xl font-black ${style.color}`}>
                          {m.type === "out" ? "-" : "+"}{Math.abs(m.quantity)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                          Unidades Impactadas
                        </div>
                      </div>
                    </div>

                    {/* Footer / Meta */}
                    <div className="mt-6 pt-4 border-t border-zinc-800/50 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                          {m.user?.name[0]}
                        </div>
                        <span className="text-xs font-medium text-zinc-500">
                          Registrado por <span className="text-zinc-300">{m.user?.name} {m.user?.lastName}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[11px] font-bold">
                          {new Date(m.createdAt).toLocaleString(undefined, { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="pt-8 flex justify-center">
        <nav className="flex items-center gap-1">
          <button className="p-2 text-zinc-600 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-black text-white shadow-lg">1</span>
          <button className="p-2 text-zinc-600 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default StockMovement;