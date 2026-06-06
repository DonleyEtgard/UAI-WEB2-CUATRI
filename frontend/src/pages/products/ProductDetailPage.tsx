import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct, useDeleteProduct } from "@/features/products";
import UiCard from "../../components/common/UiCard";
import UiBadge from "../../components/common/UiBadge";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, reload } = useProduct(id || "");
  const { handleDelete: apiDelete } = useDeleteProduct();

  useEffect(() => {
    if (id) reload();
  }, [id, reload]);

  const handleDelete = async () => {
    if (!id) return;

    const ok = confirm("¿Eliminar producto?");
    if (!ok) return;

    try {
      await apiDelete(id);
      navigate("/app/products");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <SkeletonLoader count={4} height={28} />;
  if (!product) return <div className="p-6"><EmptyState title="Producto no encontrado" description="Este producto no existe o fue eliminado." /></div>;

  return (
    <div className="container py-8">
      <h1 className="page-title">
        {product.name}
      </h1>

      <UiCard>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-muted-xs uppercase font-bold text-gray-400">Precio</p>
            <p className="text-xl text-primary font-bold">${product.price}</p>
          </div>
          <div>
            <p className="text-muted-xs uppercase font-bold text-gray-400">Costo</p>
            <p className="text-xl">${product.cost || "-"}</p>
          </div>
          <div>
            <p className="text-muted-xs uppercase font-bold text-gray-400">Stock Disponible</p>
            <p className="text-xl">{product.stock} unidades</p>
          </div>
          <div>
            <p className="text-muted-xs uppercase font-bold text-gray-400">Categoría</p>
            <p className="text-xl">{product.category?.name || "Sin categoría"}</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-muted-xs uppercase font-bold text-gray-400">Descripción</p>
          <p className="text-muted">{product.description || "Sin descripción disponible."}</p>
        </div>
      </UiCard>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-4">
        <button className="btn-secondary" onClick={() => navigate("/app/products")}>
          Volver
        </button>

        <button className="btn-primary" onClick={() => navigate(`/app/products/edit/${id}`)}>
          Editar
        </button>

        <button className="text-red-600 font-semibold hover:underline px-4" onClick={handleDelete}>
          Eliminar Producto
        </button>

        <div className="ml-auto flex items-center gap-2">
          <UiBadge label={product.isActive ? 'Activo' : 'Oculto'} color={product.isActive ? 'success' : 'default'} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;