/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";

const CustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    const loadCustomer = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/customers/${id}`);
        const c = res.data.data.customer;
        setForm({ ...c });
      } catch (err) {
        console.error(err);
        alert("Error cargando datos del cliente");
      } finally {
        setFetching(false);
      }
    };
    loadCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await API.patch(`/customers/${id}`, form);
      } else {
        await API.post("/customers", form);
      }
      navigate("/app/customers");
    } catch (err) {
      console.error(err);
      alert("Error al guardar el cliente");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-zinc-500">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="font-medium text-lg tracking-tight">Sincronizando datos del cliente...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <form 
        onSubmit={handleSubmit} 
        className="bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/5"
      >
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="bg-indigo-600/10 p-3 rounded-2xl border border-indigo-500/20">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
              </h1>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-0.5">Gestión de cartera comercial</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-2">Nombre</label>
              <input
                required
                className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. María"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-2">Apellido</label>
              <input
                required
                className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Ej. González"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-2">Email</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contacto@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-2">Teléfono</label>
              <input
                className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+54 11 ..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-2">Dirección / Notas</label>
            <textarea
              rows={4}
              className="w-full px-5 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-700 font-medium resize-none"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Calle, Ciudad, Provincia, Código Postal..."
            />
          </div>

          <div className="pt-4">
            <label className="group flex items-center gap-4 cursor-pointer select-none bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 hover:border-indigo-500/30 transition-all">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                <div className="w-12 h-6 bg-zinc-800 rounded-full peer-checked:bg-indigo-600 transition-colors shadow-inner"></div>
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-md"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors uppercase tracking-wider">Cliente Activo</span>
                <span className="text-[10px] text-zinc-600 font-medium tracking-wide">Habilita al cliente para nuevas transacciones comerciales</span>
              </div>
            </label>
          </div>
        </div>

        <div className="p-8 bg-zinc-900/50 border-t border-zinc-800 flex justify-end gap-6 items-center">
          <button 
            type="button" 
            onClick={() => navigate("/app/customers")} 
            className="px-6 py-3 text-sm font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            Descartar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white text-sm font-black rounded-2xl shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-3 ring-1 ring-white/10"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {loading ? "Sincronizando..." : isEdit ? "Actualizar Registro" : "Guardar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;