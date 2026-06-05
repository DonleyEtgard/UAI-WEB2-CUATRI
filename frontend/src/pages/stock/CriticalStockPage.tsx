import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: { name: string } | string;
}

const CriticalStockPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCriticalStock = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      // Filtramos productos con stock menor o igual a 10
      const allProducts = Array.isArray(res.data?.data?.products) ? res.data.data.products : [];
      const critical = allProducts.filter((p: Product) => p.stock <= 10);
      setProducts(critical.sort((a: Product, b: Product) => a.stock - b.stock));
    } catch (err) {
      console.error("Error loading critical stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCriticalStock();
  }, []);

  const getAlertStyles = (stock: number) => {
    if (stock === 0) {
      return {
        border: "border-rose-500/50",
        bg: "bg-rose-500/5",
        text: "text-rose-400",
        badge: "bg-rose-500/20 text-rose-400 border-rose-500/30",
        label: "Agotado",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      };
    }
    if (stock <= 5) {
      return {
        border: "border-amber-500/40",
        bg: "bg-amber-500/5",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        label: "Crítico",
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      };
    }
    return {
      border: "border-zinc-700",
      bg: "bg-zinc-900/40",
      text: "text-zinc-400",
      badge: "bg-zinc-800 text-zinc-400 border-zinc-700",
      label: "Bajo",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    };
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Alertas de Stock</h1>
          <p className="text-sm text-zinc-500 mt-1 font-bold tracking-widest uppercase">Monitoreo de Inventario Crítico</p>
        </div>
        <div className="flex items-center gap-3">
         <button
  onClick={loadCriticalStock}
  className="w-8 h-8 flex items-center justify-center rounded-lg
             hover:bg-zinc-800 transition-colors
             text-zinc-400 hover:text-white"
  title="Recargar"
>
  🔄
</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-zinc-900/50 border border-zinc-800 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[3rem] text-center">
          <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-xl font-bold text-white">Inventario Saludable</h3>
          <p className="text-zinc-500 mt-2">No hay productos con stock crítico en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const style = getAlertStyles(p.stock);
            return (
              <div 
                key={p._id} 
                className={`group relative overflow-hidden bg-zinc-950 border ${style.border} p-6 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02]`}
              >
                <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${style.text}`}>
                   <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">{style.icon}</svg>
                </div>

                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${style.badge}`}>
                        {style.label}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase">SKU: {p.sku}</span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors">
                      {p.name}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between border-t border-zinc-800/50 pt-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Existencias</p>
                      <p className={`text-3xl font-black ${style.text}`}>{p.stock}</p>
                    </div>
                    <button 
                      onClick={() => navigate("/app/stock/new")}
                      className="px-5 py-2.5 bg-zinc-900 hover:bg-white hover:text-black text-white text-xs font-black rounded-2xl transition-all shadow-xl"
                    >
                      REPONER
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CriticalStockPage;