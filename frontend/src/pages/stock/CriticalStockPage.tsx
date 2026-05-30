import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/features/products";
import { useCreateStockMovement } from "@/features/stock";
import { useAuth } from "@/context/AuthContext";

const CriticalStockPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, loading: loadingProducts, reload: reloadProducts } = useProducts();
  const { handleCreate: createMovement, loading: isProcessing } = useCreateStockMovement();

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [replenishQty, setReplenishQty] = useState<number>(0);

  // Filtrar productos con stock < 10
  const criticalItems = products.filter((p) => (p.stock || 0) < 10);

  const handleReplenish = async (productId: string) => {
    if (replenishQty <= 0) return alert("Ingrese una cantidad válida");
    if (!user?._id) return alert("Usuario no identificado");

    try {
      await createMovement({
        product: productId,
        type: "in",
        quantity: replenishQty,
        user: user._id,
        reason: "restock",
      });

      alert("Reabastecimiento registrado con éxito ✅");
      setSelectedProduct(null);
      setReplenishQty(0);
      reloadProducts(); // Recargar para ver el nuevo stock
    } catch (err) {
      console.error(err);
      alert("Error al procesar el reabastecimiento");
    }
  };

  return (
    <div className="container py-8 fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title title-gradient">Alerta de Stock Crítico</h1>
          <p className="page-subtitle">Productos con menos de 10 unidades disponibles</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate("/app/stock")}>
          Ver todos los movimientos
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          {loadingProducts ? (
            <div className="p-10 text-center text-muted">Buscando alertas...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Acción de Reabastecimiento</th>
                </tr>
              </thead>
              <tbody>
                {criticalItems.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-8 text-green-500 font-medium">
                      🎉 No hay productos con stock crítico actualmente.
                    </td>
                  </tr>
                ) : (
                  criticalItems.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="font-bold text-primary">{p.name}</div>
                        <div className="text-muted-xs">ID: #{p._id.slice(-6)}</div>
                      </td>
                      <td>
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                          {p.stock} un.
                        </span>
                      </td>
                      <td>
                        {selectedProduct === p._id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="w-24 p-1 border rounded"
                              placeholder="Cant."
                              value={replenishQty || ""}
                              onChange={(e) => setReplenishQty(Number(e.target.value))}
                              autoFocus
                            />
                            <button
                              className="btn-primary py-1 px-3 text-xs"
                              onClick={() => handleReplenish(p._id)}
                              disabled={isProcessing}
                            >
                              Confirmar
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => setSelectedProduct(null)}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-indigo-600 font-semibold hover:underline"
                            onClick={() => {
                              setSelectedProduct(p._id);
                              setReplenishQty(0);
                            }}
                          >
                            + Reabastecer Mercadería
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriticalStockPage;