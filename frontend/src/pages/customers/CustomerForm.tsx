import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  useCustomer, 
  useCreateCustomer, 
  useUpdateCustomer,
  type Customer 
} from "@/features/customers";

const emptyCustomer: Partial<Customer> = {
  name: "",
  email: "",
  phone: "",
};

const CustomerForm = () => {
  const [form, setForm] = useState<Partial<Customer>>(emptyCustomer);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { customer, reload: fetchCustomer } = useCustomer(id || "");
  const { handleCreate, loading: creating } = useCreateCustomer();
  const { handleUpdate, loading: updating } = useUpdateCustomer();

  const isEdit = Boolean(id);
  const loading = creating || updating;

  useEffect(() => {
    if (id) fetchCustomer();
  }, [id, fetchCustomer]);

  useEffect(() => {
    if (customer && isEdit) {
      setForm(customer);
    }
  }, [customer, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit && id) {
        await handleUpdate(id, form);
      } else {
        await handleCreate(form as Customer);
      }
      navigate("/app/customers");
    } catch (err) {
      console.error("Error saving customer:", err);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="page-title">
        {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
      </h1>

      {/* PERSONAL */}
      <div className="card">
        <h3>Información Personal</h3>

        <input
          name="name"
          placeholder="Nombre Completo"
          value={form.name || ""}
          onChange={handleChange}
        />
      </div>

      {/* CONTACT */}
      <div className="card">
        <h3>Contacto</h3>

        <input
          name="email"
          placeholder="Email"
          value={form.email || ""}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Teléfono"
          value={form.phone || ""}
          onChange={handleChange}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button onClick={() => navigate("/app/customers")}>
          Cancelar
        </button>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;