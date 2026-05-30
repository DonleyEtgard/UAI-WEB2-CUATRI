import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createStockMovement } from "../../services/stock.service.ts";

type FormState = {
  product: string;
  type: "in" | "out";
  quantity: number;
  user: string;
  reason: string;
  sale?: string;
};

export default function StockMovementForm() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>({
    product: "",
    type: "in",
    quantity: 1,
    user: user?._id || "",
    reason: "adjustment",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "quantity"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createStockMovement({
        ...form,
        user: user?._id || form.user // Aseguramos el ID del usuario actual
      });

      alert("Movimiento creado correctamente");

      setForm((prev) => ({
        ...prev,
        product: "",
        type: "in",
        quantity: 1,
        reason: "adjustment",
      }));
    } catch (error) {
      console.error(error);
      alert("Error al crear movimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <h2>Crear Movimiento de Stock</h2>

      <input
        name="product"
        placeholder="Product ID"
        value={form.product}
        onChange={handleChange}
      />

      <select name="type" value={form.type} onChange={handleChange}>
        <option value="in">Ingreso</option>
        <option value="out">Salida</option>
      </select>

      <input
        name="quantity"
        type="number"
        min={1}
        value={form.quantity}
        onChange={handleChange}
      />

      <input
        name="user"
        placeholder="User ID"
        value={form.user}
        onChange={handleChange}
      />

      <select name="reason" value={form.reason} onChange={handleChange}>
        <option value="sale">Sale</option>
        <option value="purchase">Purchase</option>
        <option value="return">Return</option>
        <option value="initial_stock">Initial Stock</option>
        <option value="adjustment">Adjustment</option>
        <option value="damage">Damage</option>
        <option value="loss">Loss</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear Movimiento"}
      </button>
    </form>
  );
}