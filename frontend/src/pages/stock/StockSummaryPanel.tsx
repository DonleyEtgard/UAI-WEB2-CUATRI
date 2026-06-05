import { useEffect, useState } from "react";
import { getStockSummary } from "../../services/stock.service.ts";
import { Box, Typography } from "@mui/material";

interface StockSummary {
  totalIn: number;
  totalOut: number;
  balance: number;
}

export default function StockSummaryPanel() {
  const [data, setData] = useState<StockSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await getStockSummary();
      setData(res);
    };
    load();
  }, []);

  if (!data) return <Typography variant="caption" sx={{ color: '#9ca3af' }}>Obteniendo balance...</Typography>;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {[
        { label: "Entradas", value: data.totalIn, color: "#10b981" },
        { label: "Salidas", value: data.totalOut, color: "#ef4444" },
        { label: "Balance", value: data.balance, color: "#6366f1" },
      ].map((item, idx) => (
        <Box key={idx} sx={{ 
            p: 1.5, 
            bgcolor: 'rgba(255,255,255,0.03)', 
            borderRadius: 2, 
            border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'center'
          }}>
            <Typography variant="overline" sx={{ color: '#9ca3af', display: 'block', fontSize: '0.65rem', lineHeight: 1 }}>
              {item.label}
            </Typography>
            <Typography variant="body1" sx={{ color: item.color, fontWeight: 800, fontSize: '1.1rem' }}>
              {item.value}
            </Typography>
          </Box>
      ))}
    </Box>
  );
}