import { useEffect, useState } from "react";
import { firebaseAxios } from "../../config/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await firebaseAxios.get("/sales");

      // 🔥 transformar datos para gráfica
      const formatted = res.data.map((sale: any) => ({
        date: new Date(sale.createdAt).toLocaleDateString(),
        total: sale.total,
      }));

      setData(formatted);
    };

    fetch();
  }, []);

  return (
    <div className="w-full h-[300px]">

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>

          {/* GRID */}
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

          {/* AXIS */}
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />

          {/* TOOLTIP */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              border: "1px solid #1f2937",
              borderRadius: "10px",
              color: "#fff",
            }}
          />

          {/* LINE */}
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}