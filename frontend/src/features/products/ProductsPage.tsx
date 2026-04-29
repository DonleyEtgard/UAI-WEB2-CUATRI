import { useState } from "react";
import { useProducts } from "./hooks";
import ProductForm from "./ProductForm";


const ProductsPage = () => {
  const {
    products,
    addProduct,
    editProduct,
    removeProduct,
    loadProducts
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // 🆕 nuevo producto
  const handleCreate = async (data: any) => {
    await addProduct(data);
    setShowForm(false);
  };

  // ✏️ editar producto
  const handleEdit = async (data: any) => {
    if (!selectedProduct) return;

    await editProduct(selectedProduct._id, data);
    setSelectedProduct(null);
    setShowForm(false);
  };

  // ❌ eliminar
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    await removeProduct(id);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produits</h1>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Nouveau Produit
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p: any) => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.category || "-"}</td>

                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <ProductForm
            onSubmit={selectedProduct ? handleEdit : handleCreate}
            initialData={selectedProduct}
            onClose={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;