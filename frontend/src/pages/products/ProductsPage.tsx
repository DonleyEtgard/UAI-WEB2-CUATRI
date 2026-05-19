import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  isActive: boolean;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/products");
      setProducts(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;

    await API.delete(`/products/${id}`);
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const lowStock = products.filter(p => p.stock < 5).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📦 Products</h1>

        <button
          onClick={() => navigate("/products/new")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + New Product
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total</p>
          <p className="text-xl font-bold">{products.length}</p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-green-700">In Stock</p>
          <p className="text-lg font-bold">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <p className="text-red-700">Low Stock</p>
          <p className="text-lg font-bold">{lowStock}</p>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">

                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.stock}</td>

                  <td className="p-3">
                    <span className={p.isActive ? "text-green-600" : "text-red-600"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 text-right space-x-2">

                    <button
                      onClick={() => navigate(`/products/${p._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/products/edit/${p._id}`)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};

export default ProductsPage;