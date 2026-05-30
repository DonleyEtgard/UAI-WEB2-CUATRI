import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import type { Product, AppUser } from "../../types/firestore";

export default function ProductsPage() {
  const { user: currentUser } = useAuth() as { user: AppUser | null };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Lógica de Permisos (RBAC)
  const canManage = (p: Product) => {
    if (currentUser?.role === "superadmin") return true;
    return currentUser?.role === "admin" && p.createdBy === currentUser._id;
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      // El Backend DEBE filtrar por createdBy si req.user.role === 'admin'
      const res = await API.get<Product[]>("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button className="btn-primary">Nuevo Producto</button>
      </div>

      <div className="border rounded bg-white overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Cargando...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3 text-right space-x-2">
                    {canManage(product) && (
                      <>
                        <button className="text-blue-600">Editar</button>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="text-red-600"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}