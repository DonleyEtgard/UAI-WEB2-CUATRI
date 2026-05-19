import { useEffect, useState } from "react";
import API from "../../services/api";

const SalesReportPage = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    API.get("/sales").then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Sales Report</h1>

      <div className="bg-white p-4 rounded-xl shadow">

        {data.map((sale) => (
          <div key={sale._id} className="flex justify-between border-b py-2">

            <span>{sale.customer || "N/A"}</span>
            <span>${sale.total}</span>
            <span>{sale.paymentMethod}</span>

          </div>
        ))}

      </div>

    </div>
  );
};

export default SalesReportPage;