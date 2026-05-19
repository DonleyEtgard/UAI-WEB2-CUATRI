import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

const SaleDetailPage = () => {
  const { id } = useParams();
  const [sale, setSale] = useState<any>(null);

  useEffect(() => {
    API.get(`/sales/${id}`).then((res) => setSale(res.data));
  }, [id]);

  if (!sale) return <p>Loading sale...</p>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold">Sale #{sale._id}</h1>
        <p className="text-gray-500">{sale.createdAt}</p>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Customer</p>
          <p>{sale.customer || "Walk-in"}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total</p>
          <p className="text-lg font-bold">${sale.total}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Payment</p>
          <p>{sale.paymentMethod}</p>
        </div>

      </div>

    </div>
  );
};

export default SaleDetailPage;