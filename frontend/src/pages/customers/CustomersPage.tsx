import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Customer {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/customers");
      setCustomers(Array.isArray(res.data?.data?.customers) ? res.data.data.customers : []);
    } catch (err) {
      console.error("Error loading customers:", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desea eliminar este cliente?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando cliente");
    } finally {
      setDeletingId(null);
    }
  };

  // KPIs
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.isActive).length;
  const newThisMonth = customers.filter(c => {
    const date = new Date(c.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="p-4 sm:p-8 space-y-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Clientes</h1>
          <p className="text-sm text-zinc-400 mt-1">Administra tu cartera de clientes y su información de contacto.</p>
        </div>
        <button
          onClick={() => navigate("/app/customers/new")}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Clientes</p>
          <h2 className="text-2xl font-bold mt-1 text-white">{totalCustomers}</h2>
        </div>
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Activos</p>
          <h2 className="text-2xl font-bold mt-1 text-emerald-400">{activeCustomers}</h2>
        </div>
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Nuevos este mes</p>
          <h2 className="text-2xl font-bold mt-1 text-indigo-400">+{newThisMonth}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/30">
          <h2 className="font-semibold text-lg text-white">Directorio de Clientes</h2>
          <button
             onClick={loadCustomers}
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
              <tr className="text-zinc-500 border-b border-zinc-800 bg-zinc-900/10">
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Cliente</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Email</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Teléfono</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Estado</th>
                <th className="text-right px-6 py-4 font-medium uppercase tracking-wider text-[11px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="h-9 w-9 bg-zinc-800 rounded-full"></div><div className="h-4 bg-zinc-800 rounded w-24"></div></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-zinc-800 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-zinc-800 rounded w-16"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-zinc-800 rounded w-20 float-right"></div></td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-zinc-500 font-medium italic">No se encontraron clientes registrados</td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="group hover:bg-zinc-800/30 transition-all border-b border-zinc-800/50 last:border-0">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-xs uppercase tracking-tighter">
                          {c.name[0]}{c.lastName[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{c.name} {c.lastName}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">#{c._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{c.email}</td>
                    <td className="px-6 py-4 text-zinc-400 font-medium">{c.phone || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        c.isActive 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${c.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                        {c.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/app/customers/edit/${c._id}`)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-all"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button
                          disabled={deletingId === c._id}
                          onClick={() => handleDelete(c._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all disabled:opacity-30"
                          title="Eliminar"
                        >
                          {deletingId === c._id ? (
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

export default CustomersPage;