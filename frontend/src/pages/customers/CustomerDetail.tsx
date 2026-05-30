import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer, useDeleteCustomer } from "@/features/customers";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customer, loading, reload } = useCustomer(id || "");
  const { handleDelete: apiDelete } = useDeleteCustomer();

  useEffect(() => {
    if (id) reload();
  }, [id, reload]);

  const handleDelete = async () => {
    if (!id) return;

    const ok = confirm("¿Eliminar cliente?");
    if (!ok) return;

    try {
      await apiDelete(id);
      navigate("/app/customers");
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!customer) return <p>No encontrado</p>;

  return (
    <div className="container py-8">
      <h1 className="page-title">
        {customer.name}
      </h1>

      {/* INFO */}
      <div className="card">
        <p>Email: {customer.email || "-"}</p>
        <p>Teléfono: {customer.phone || "-"}</p>
        <p>Deuda: ${customer.debt || 0}</p>
        <p>
          Creado: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button onClick={() => navigate("/app/customers")}>
          Volver
        </button>

        <button onClick={() => navigate(`/app/customers/edit/${id}`)}>
          Editar
        </button>

        <button onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default CustomerDetail;