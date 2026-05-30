import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export interface SaleItemInput {
  product: string;
  quantity: number;
}

const SaleFormPage = () => {
  const { user } = useAuth();
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<"cash" | "card" | "transfer">("cash");

  const [amountPaid, setAmountPaid] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<SaleItemInput[]>([]);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  // ==========================
  // ADD ITEM
  // ==========================
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { product: "", quantity: 1 },
    ]);
  };

  // ==========================
  // UPDATE ITEM
  // ==========================
  const updateItem = (
    index: number,
    field: keyof SaleItemInput,
    value: string | number
  ) => {
    const copy = [...items] as any[];
    (copy[index] as any)[field] = value;
    setItems(copy);
  };

  // ==========================
  // REMOVE ITEM
  // ==========================
  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async () => {
    if (saving || items.length === 0) return;

    setSaving(true);

    try {
      await API.post("/sales", {
        customerId: customer,
        userId: user?._id,
        paymentMethod,
        items,
        amountPaid,
        notes,
        currency: "ARS", // Default
        status: amountPaid >= 1 ? "partially_paid" : "pending" 
      });

      navigate("/sales");
    } catch (err) {
      console.error("Error creating sale:", err);
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Nueva Venta</h1>

      {/* HEADER FORM */}
      <div className="card space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Cliente (ID)</label>
            <input
              className="input w-full mt-1"
              placeholder="ID del Cliente"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Método de Pago</label>
            <select
              className="input w-full mt-1"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value as "cash" | "card" | "transfer"
                )
              }
            >
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Monto Pagado</label>
            <input
              className="input w-full mt-1"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Notas</label>
            <input
              className="input w-full mt-1"
              placeholder="Opcional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Productos ({items.length})</h3>
        <button className="text-sm text-blue-600 font-medium" onClick={addItem}>
          + Agregar Producto
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="card flex items-center gap-4 bg-gray-50">
            <input
              className="input flex-1"
              placeholder="ID del Producto"
              value={item.product}
              onChange={(e) => updateItem(i, "product", e.target.value)}
            />
            <input
              className="input w-24"
              type="number"
              placeholder="Cant."
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
            />
            <button className="text-red-500 p-2 hover:bg-red-50 rounded" onClick={() => removeItem(i)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          className="btn-primary flex-1"
          onClick={handleSubmit}
          disabled={saving || items.length === 0}
        >
          {saving ? "Guardando..." : "Registrar Venta"}
        </button>
        <button className="btn-secondary" onClick={() => navigate("/sales")}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SaleFormPage;