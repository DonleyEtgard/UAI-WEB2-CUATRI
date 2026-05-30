import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  createProduct,
  updateProduct,
  getProductById
} from "../../services/products.service";
import type { AppUser, Currency } from "../../types/firestore";

const emptyProduct: {
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  currency: Currency;
  category: string;
} = {
  name: "",
  description: "",
  price: 0,
  cost: 0,
  stock: 0,
  currency: "ARS",
  category: "",
};

const ProductFormPage = () => {
  const { user: currentUser } = useAuth() as { user: AppUser | null };
  const [form, setForm] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // ==========================
  // LOAD PRODUCT (edit mode)
  // ==========================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setForm({
          name: data.name,
          description: data.description || "",
          price: data.price,
          cost: data.cost || 0,
          stock: data.stock,
          currency: (data.currency as Currency) || "ARS",
          category: (typeof data.category === "string" ? data.category : (data.category as any)?.name) || "",
        });
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (
    field: keyof typeof form,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================
  // SUBMIT (CREATE / UPDATE)
  // ==========================
  const validate = () => {
    if (!form.name || form.price <= 0) {
      alert("Nombre y precio son obligatorios");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (saving || !validate()) return;

    setSaving(true);

    try {
      if (isEdit && id) {
        await updateProduct(id, form as any);
      } else {
        // Inyectamos los campos de auditoría y organización
        const newProductData = {
          ...form,
          organizationId: currentUser!.organizationId!,
          createdBy: currentUser!._id,
        };
        await createProduct(newProductData as any);
      }

      navigate("/products");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // CANCEL SAFE BUTTON
  // ==========================
  const handleCancel = () => {
    if (saving) return;
    navigate("/products");
  };

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div className="container py-8">
      <h1>{isEdit ? "Editar Producto" : "Nuevo Producto"}</h1>

      {/* FORM */}
      <div className="card">
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) =>
            handleChange("description", e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            handleChange("price", Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Costo"
          value={form.cost}
          onChange={(e) =>
            handleChange("cost", Number(e.target.value))
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            handleChange("stock", Number(e.target.value))
          }
        />

        <select
          value={form.currency}
          onChange={(e) =>
            handleChange("currency", e.target.value)
          }
        >
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <button onClick={handleCancel} disabled={saving}>
          Cancelar
        </button>

        <button onClick={handleSubmit} disabled={saving}>
          {saving
            ? "Guardando..."
            : isEdit
            ? "Actualizar"
            : "Crear Producto"}
        </button>
      </div>
    </div>
  );
};

export default ProductFormPage;