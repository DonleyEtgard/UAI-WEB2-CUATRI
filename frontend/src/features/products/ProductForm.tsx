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
    image: ""
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPreview(initialData.image || null);
    }
  }, [initialData]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    setForm({
      ...form,
      image: url
    });
  };

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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-black"
    >
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Product" : "New Product"}
      </h2>

      {/* IMAGE */}
      <input type="file" accept="image/*" onChange={handleImage} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover mt-2 rounded"
        />
      )}

      {/* INPUTS (sin Tailwind extra, usa tu CSS global) */}
      <input
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        type="number"
        name="cost"
        placeholder="Cost"
        value={form.cost}
        onChange={handleChange}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />

      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />

      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      {/* BUTTONS */}
      <div className="flex justify-between mt-4">

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Cancel
          </button>
        )}

      </div>
    </form>
  );
};

export default ProductForm;