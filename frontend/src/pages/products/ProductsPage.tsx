import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setProducts(Array.isArray(res.data?.data?.products) ? res.data.data.products : []);
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desea eliminar este producto?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    } finally {
      setDeletingId(null);
    }
  };

  // KPIs
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 5).length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Productos</h1>
          <p className="text-sm text-zinc-400 mt-1">Gestiona tu inventario, precios y existencias.</p>
        </div>
        <button
          onClick={() => navigate("/app/products/new")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: totalProducts, color: "text-white" },
          { label: "Stock Bajo", value: lowStock, color: "text-amber-400" },
          { label: "Activos", value: activeProducts, color: "text-emerald-400" },
          { label: "Valor Inventario", value: `$${inventoryValue.toLocaleString()}`, color: "text-indigo-400" },
        ].map((kpi, i) => (
          <div key={i} className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{kpi.label}</p>
            <h2 className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</h2>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          <h2 className="font-semibold text-lg text-white">Inventario Detallado</h2>
        <button
             onClick={loadProducts}
             className="w-8 h-8 flex items-center justify-center rounded-lg
             hover:bg-zinc-800 transition-colors
             text-zinc-400 hover:text-white"
             title="Recargar"
              >
             🔄
        </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-800">
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Producto</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Categoría</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Precio</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Stock</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Estado</th>
                <th className="text-right px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-10 bg-zinc-800 rounded-lg inline-block mr-3 align-middle"></div><div className="h-4 bg-zinc-800 rounded w-24 inline-block"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-zinc-800 rounded w-20 float-right"></div></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-zinc-500 font-medium">No hay productos registrados</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="group hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover:text-indigo-400 transition-colors">{p.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-medium capitalize">{p.category}</td>
                    <td className="px-6 py-4 text-white font-semibold">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        p.stock < 5 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : 
                        p.stock < 15 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : 
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {p.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`h-2 w-2 rounded-full inline-block mr-2 ${p.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-zinc-600"}`}></span>
                      <span className="text-xs text-zinc-300">{p.isActive ? "Activo" : "Oculto"}</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/app/products/edit/${p._id}`)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button
                          disabled={deletingId === p._id}
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all disabled:opacity-30"
                          title="Eliminar"
                        >
                          {deletingId === p._id ? (
                             <div className="w-4 h-4 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          )}
                        </button>
                      </div>
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

export default ProductsPage;