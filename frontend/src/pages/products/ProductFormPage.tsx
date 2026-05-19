import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex justify-between">
        <div>
          <h1 className="text-xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.category}</p>
        </div>

        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
          Delete
        </button>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Price</p>
          <p className="text-lg font-bold">${product.price}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Stock</p>
          <p className="text-lg font-bold">{product.stock}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Status</p>
          <p>{product.isActive ? "Active" : "Inactive"}</p>
        </div>

      </div>

    </div>
  );
};

export default ProductDetailPage;