import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    stock: 0,
    category: "general",
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/products/${id}`);
        const p = res.data.data.product;
        setForm({ ...p });
      } catch (err) {
        console.error(err);
        alert("Error cargando producto");
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await API.patch(`/products/${id}`, form);
      } else {
        await API.post("/products", form);
      }
      navigate("/app/products");
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Cargando datos del producto...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isEdit ? "Editar Producto" : "Nuevo Producto"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Ingresa los detalles técnicos y comerciales del artículo.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Nombre del Producto</label>
              <input
                required
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. MacBook Pro M3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">SKU / Código</label>
              <input
                required
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600 font-mono"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="MBP-M3-2024"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Precio (USD)</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Stock Inicial</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Categoría</label>
              <select
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white appearance-none cursor-pointer"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="electronics">Electrónica</option>
                <option value="office">Oficina</option>
                <option value="services">Servicios</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/app/products")} className="px-5 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Cancelar</button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-95 flex items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {loading ? "Guardando..." : isEdit ? "Actualizar Producto" : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;