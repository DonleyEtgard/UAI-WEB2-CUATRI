import { useState } from "react";
import { createCustomer } from "../../services/customers.service";

const CustomersPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    debt: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createCustomer({
  personalInfo: {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
  },

  contactInfo: {
    email: form.email.trim(),
    phone: form.phone.trim(),
  },

  debt: Number(form.debt) || 0,

  payments: [],
});

      alert("Cliente creado ✅");

      // reset limpio
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        debt: "",
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("Error al crear cliente ❌");
    }
  };

  return (
    <div className="p-4 max-w-md">
      <h1 className="text-xl font-bold mb-4">
        Nuevo Cliente
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Juan"
            required
          />
        </div>

        {/* Apellido */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Pérez"
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="correo@email.com"
            required
          />
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="+54 9 341..."
          />
        </div>

        {/* Deuda */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            Deuda Inicial
          </label>
          <input
            type="number"
            name="debt"
            value={form.debt}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar Cliente
        </button>

      </form>
    </div>
  );
};

export default CustomersPage;