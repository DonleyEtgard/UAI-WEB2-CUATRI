import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface Sale {
  _id: string;
  customerId: string;
  totalAmount: number;
  amountPaid: number;
  status: string;
  currency: string;
  createdAt: string;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await API.get<Sale[]>("/sales");
      setSales(res.data ?? []);
    } catch (err) {
      console.error("Error loading sales:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleDelete = async (id: string) => {
    if (deletingId === id) return;

    const ok = confirm("¿Eliminar venta?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await API.delete(`/sales/${id}`);
      setSales((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ventas</h1>

        <button 
          className="btn-primary"
          onClick={() => navigate("/sales/new")}
        >
          Nueva Venta
        </button>
      </div>

      <div className="border rounded bg-white overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Cargando ventas...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold">Cliente</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Pagado</th>
                <th className="p-3 font-semibold">Estado</th>
                <th className="p-3 font-semibold">Fecha</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">No hay ventas registradas.</td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr key={s._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{s.customerId}</td>
                    <td className="p-3 font-medium">${s.totalAmount}</td>
                    <td className="p-3 text-green-600">${s.amountPaid}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-3">
                      <button 
                        className="text-blue-600 hover:underline"
                        onClick={() => navigate(`/sales/${s._id}`)}
                      >
                        Ver
                      </button>
                      <button
                        className="text-red-600 hover:underline disabled:opacity-50"
                        onClick={() => handleDelete(s._id)}
                        disabled={deletingId === s._id}
                      >
                        {deletingId === s._id ? "..." : "Eliminar"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesPage;