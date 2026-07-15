import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Card, CardContent, CardHeader, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import * as API from "../../services/stock.service";
import StockFilterForm from "./StockFilterForm";
import StockSummaryPanel from "./StockSummaryPanel";


import {
  getStockMovements,
  getMovementsByProduct,
} from "../../services/stock.service";

import { LineChartComponent } from "../../components/dashboard/LineChartComponent";
import { useTranslation } from "react-i18next";

export function useStockMovements() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStockMovements();
        setMovements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading stock movements for hook:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { movements, loading };
}

export default function StockMovement() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const loadMovements = async (productId?: string) => {
    try {
      setLoading(true);

      const data = productId
        ? await getMovementsByProduct(productId)
        : await getStockMovements();
        console.log("STOCK DATA:", data);
      setMovements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading stock movements:", error);
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const handleFilter = (productId?: string) => {
    loadMovements(productId);
  };

  const handleNewStock = () => {
    navigate("/app/stock/movement/new");
  };

  const totalEntries = useMemo(
    () =>
      movements
        .filter((m) => m.type === "in")
        .reduce((acc, m) => acc + Number(m.quantity || 0), 0),
    [movements]
  );

  const totalExits = useMemo(
    () =>
      movements
        .filter((m) => m.type === "out")
        .reduce((acc, m) => acc + Number(m.quantity || 0), 0),
    [movements]
  );

  const netBalance = totalEntries - totalExits;

  const todayMovements = useMemo(() => {
    const today = new Date().toDateString();
    return movements.filter(
      (m) => new Date(m.createdAt).toDateString() === today
    ).length;
  }, [movements]);

  const chartData = useMemo(() => {
    if (!movements.length) return [];

    return movements.reduce((acc: any[], mov: any) => {
      if (!mov.createdAt) return acc;

      const date = new Date(mov.createdAt).toLocaleDateString();

      const existing = acc.find((x) => x.date === date);

      if (existing) {
        if (mov.type === "in") existing.in += Number(mov.quantity || 0);
        else existing.out += Number(mov.quantity || 0);
      } else {
        acc.push({
          date,
          in: mov.type === "in" ? Number(mov.quantity || 0) : 0,
          out: mov.type === "out" ? Number(mov.quantity || 0) : 0,
        });
      }

      return acc;
    }, []);
  }, [movements]);

  const stockTrendData = useMemo(() => {
    if (!chartData.length) {
      return {
        categories: [t("stock.movements.noData")],
        series: [
          { name: t("stock.movements.entries"), data: [0] },
          { name: t("stock.movements.exits"), data: [0] },
        ],
      };
    }

    return {
      categories: chartData.map((c) => c.date),
      series: [
        { name: t("stock.movements.entries"), data: chartData.map((c) => c.in) },
        { name: t("stock.movements.exits"), data: chartData.map((c) => c.out) },
      ],
    };
  }, [chartData]);

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, pb: 3, borderBottom: '2px solid #e0e7ff' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>📦 {t("stock.movements.title")}</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>{t("stock.movements.subtitle")}</p>
        </Box>

        {/* Filter Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <StockFilterForm onFilter={handleFilter} onReload={loadMovements} />
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: t("stock.movements.entries"), value: totalEntries, color: "success" },
            { label: t("stock.movements.exits"), value: totalExits, color: "error" },
            { label: t("stock.movements.today"), value: todayMovements, color: "info" },
            { label: t("stock.movements.netBalance"), value: netBalance, color: netBalance >= 0 ? "success" : "error" },
          ].map((kpi, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{kpi.label}</p>
                  <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.875rem', fontWeight: 900 }}>{kpi.value}</h3>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Summary Panel */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardContent>
            <StockSummaryPanel />
          </CardContent>
        </Card>

        {/* Chart */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardHeader title={t("stock.movements.stockTrend")} />
          <CardContent>
            <LineChartComponent
              title={t("stock.movements.entriesVsExits")}
              series={stockTrendData.series}
              categories={stockTrendData.categories}
            />
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardHeader 
            title={t("stock.movements.registeredMovements")} 
            action={
              <Button 
                startIcon={<RefreshIcon />}
                onClick={() => loadMovements()}
                disabled={loading}
                size="small"
                variant="outlined"
                sx={{ fontSize: 14, textTransform: 'none', color: 'white' }}
              >
              
              </Button>
            }
          />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell><strong>{t("stock.movements.product")}</strong></TableCell>
                      <TableCell align="center"><strong>{t("stock.movements.type")}</strong></TableCell>
                      <TableCell align="center"><strong>{t("stock.movements.quantity")}</strong></TableCell>
                      <TableCell><strong>{t("stock.movements.date")}</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {movements.map((m, i) => (
                      <TableRow key={m._id || i} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        <TableCell>{m?.product?.name || m.productId}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={m.type === "in" ? t("stock.movements.entry") : t("stock.movements.exit")} 
                            color={m.type === "in" ? "success" : "error"} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center"><strong>{m.quantity}</strong></TableCell>
                        <TableCell>{new Date(m.createdAt).toLocaleString('es-ES')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleNewStock}
            sx={{ textTransform: 'none', fontSize: 14, fontWeight: 700 }}
          >
            {t("stock.movements.registerMovement")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}