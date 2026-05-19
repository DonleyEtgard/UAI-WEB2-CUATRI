import { useState } from "react";
import API from "../../services/api";

const ProductFormPage = () => {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: ""
  });

  const handleSubmit = async () => {
    await API.post("/products", form);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <h1 className="text-xl font-bold">Create Product</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Price"
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full border p-2 rounded"
        placeholder="Stock"
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Category"
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Save Product
      </button>

    </div>
  );
};

export default ProductFormPage;