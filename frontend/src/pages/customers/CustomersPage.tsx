import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomers, useDeleteCustomer } from "@/features/customers";
import { useAuth } from "@/context/AuthContext";

const CustomersPage = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();
  const { customers, loading, reload } = useCustomers();
  const { handleDelete: apiDelete } = useDeleteCustomer();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Si el contexto de auth aún está cargando el token, no mostramos nada para evitar el 401
  if (isLoading) return <div className="p-10 text-center">Verificando sesión...</div>;
  if (!isAuthenticated) return null; // El router debería redirigir, pero esto es seguridad extra.

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    const ok = confirm("¿Eliminar cliente?");
    if (!ok) return;

    try {
      setDeletingId(id);
      await apiDelete(id);
      reload();
      setDeletingId(null);
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  return (
    <div className="container py-8 fade-in-up">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="page-title title-gradient">
            Directorio de Clientes
          </h1>
          <p className="page-subtitle">
            Gestiona la relación con tus compradores
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate("/app/customers/new")}
        >
          Nuevo Cliente
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-container">
          {loading ? (
            <div className="p-10 text-center text-muted">
              Cargando clientes...
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Fecha</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-muted">
                      No hay clientes
                    </td>
                  </tr>
                ) : (
                  customers.map((c, index) => (
                    <tr key={c._id || index}>
                      {/* CLIENTE */}
                      <td>
                        <div className="font-bold text-primary">
                          {c.name}
                        </div>

                        <div className="text-muted-xs">
                          ID: #{c._id?.slice(-6)}
                        </div>
                      </td>

                      {/* CONTACTO */}
                      <td>
                        <div>{c.email || "-"}</div>
                        <div>{c.phone || "-"}</div>
                      </td>

                      {/* FECHA */}
                      <td>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}
                      </td>

                      {/* ACTIONS */}
                      <td className="text-right">
                        <button
                          className="text-blue-600 hover:underline mr-4"
                          onClick={() =>
                            navigate(`/app/customers/${c._id}`)
                          }
                        >
                          Ver
                        </button>

                        <button
                          className="text-indigo-600 hover:underline mr-4"
                          onClick={() =>
                            navigate(`/app/customers/edit/${c._id}`)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="text-red-600 hover:underline disabled:opacity-50"
                          onClick={() => c._id && handleDelete(c._id)}
                          disabled={deletingId === c._id}
                        >
                          {deletingId === c._id ? "..." : "Eliminar"}
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
    </div>
  );
};

export default CustomersPage;