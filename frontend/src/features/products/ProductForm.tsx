import { useState, useEffect } from "react";

type ProductFormProps = {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  onClose?: () => void;
};

const ProductForm = ({ onSubmit, initialData, onClose }: ProductFormProps) => {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    cost: 0,
    stock: 0,
    description: "",
    category: "",
    image: "" // 🔥 nuevo
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPreview(initialData.image || null);
    }
  }, [initialData]);

  // 🔥 manejar imagen
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview local
    const url = URL.createObjectURL(file);
    setPreview(url);

    // ⚠️ por ahora simulamos (después lo subís a server)
    setForm({
      ...form,
      image: url
    });
  };

  // ✏️ cambios normales
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "price" || name === "cost" || name === "stock"
          ? Number(value)
          : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || form.price <= 0) {
      alert("Name and price are required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Product" : "New Product"}
      </h2>

      {/* 📷 IMAGE */}
      <input type="file" accept="image/*" onChange={handleImage} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover mt-2 rounded"
        />
      )}

      <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

      <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

      <input type="number" name="cost" placeholder="Cost" value={form.cost} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

      <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full mb-4 p-2 border rounded" />

      <div className="flex justify-between">
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Saving..." : "Save"}
        </button>

        {onClose && (
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;