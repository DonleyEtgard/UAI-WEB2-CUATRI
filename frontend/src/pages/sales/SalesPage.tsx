import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { Box, Grid, Card, CardContent, CardHeader, Button, Chip, Container, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import API from "../../services/api";
import DataGridWrapper from "../../components/common/DataGridWrapper";
import EmptyState from "../../components/common/EmptyState";
import { useTranslation } from "react-i18next";

interface Sale {
  _id: string;
  customer: { name: string; lastName: string } | string;
  total: number;
  costTotal: number;
  status: "paid" | "pending" | "cancelled";
  createdAt: string;
  itemsCount: number;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await API.get("/sales");
      console.log("SALES RESPONSE:", res.data);
      const salesData = res.data?.data || [];
      console.log("PRIMERA VENTA:", salesData[0]);
      console.log("SALES ARRAY:", salesData);
      setSales(Array.isArray(salesData) ? salesData : []);
    } catch (err) {
      console.error("Error loading sales:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  // KPIs
  const totalRevenue = sales.reduce((acc, s) => acc + (s.status === 'paid' ? s.total : 0), 0);
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;
  const totalExpenses = sales.reduce((acc, sale) => acc + (sale.costTotal || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin =totalRevenue > 0 ? (netProfit / totalRevenue) * 100
    : 0;

  // Chart Data
  const chartData = useMemo(() => {
  const revenueByDay: Record<string, number> = {};
  const expenseByDay: Record<string, number> = {};

  const sortedSales = [...sales].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  sortedSales.forEach((sale) => {
    const date = new Date(sale.createdAt)
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short"
      });

    revenueByDay[date] =
      (revenueByDay[date] || 0) +
      (sale.status === "paid" ? sale.total : 0);

    expenseByDay[date] =
      (expenseByDay[date] || 0) +
      (sale.costTotal || 0);
  });

  return {
    categories: Object.keys(revenueByDay),
    revenueSeries: Object.values(revenueByDay),
    expenseSeries: Object.values(expenseByDay)
  };
}, [sales]);

  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case "paid": return "success";
      case "pending": return "warning";
      case "cancelled": return "error";
      default: return "default";
    }
  };
  

  // DataGrid columns
  const columns = [
    { field: 'ref', headerName: t("sales.list.reference"), width: 140, renderCell: (params: any) => `#${params.row._id.slice(-8)}` },
    { field: 'customerName', headerName: t("sales.list.customer"), width: 200, renderCell: (params: any) => params.row.customer && typeof params.row.customer === 'object' ? `${params.row.customer.name} ${params.row.customer.lastName}` : t("sales.list.finalConsumer") },
    { field: 'date', headerName: t("sales.list.date"), width: 140, renderCell: (params: any) => new Date(params.row.createdAt).toLocaleDateString('es-ES') },
    { field: 'itemsCount', headerName: t("sales.list.items"), width: 100, renderCell: (params: any) => `${params.row.itemsCount || 0} ${t("sales.list.pieces")}` },
    { field: 'status', headerName: t("sales.list.status"), width: 130, renderCell: (params: any) => <Chip label={params.row.status} color={getStatusColor(params.row.status)} size="small" /> },
    { field: 'total', headerName: t("sales.list.total"), width: 120, align: 'right' as const, renderCell: (params: any) => `$${params.row.total.toFixed(2)}` },
    { field: 'actions', headerName: t("sales.list.actions"), width: 120, align: 'center' as const, sortable: false, renderCell: (params: any) => (
     <Button
       size="small"
       variant="outlined"
       onClick={() => navigate(`/app/sales/${params.row._id}`)}
       sx={{
       color: "white",
       borderColor: "#fff",
       "&:hover": {
       borderColor: "#fff",
       backgroundColor: "rgba(255,255,255,0.08)",
      },
    }}
   >
  {t("sales.list.details")}
</Button>
    ) },
  ];

  const rows = sales.map(s => ({ ...s, id: s._id }));


  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, pb: 3, borderBottom: '2px solid #e0e7ff' }}>
          <Box> 
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>{t("sales.list.title")} <span style={{ color: '#6366f1' }}>{t("sales.list.highlight")}</span></h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{t("sales.list.subtitle")}</p>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              startIcon={<RefreshIcon />}
              onClick={loadSales} 
              disabled={loading}
              variant="outlined"
              sx={{ fontSize: 14, textTransform: 'none' , color: 'white' }}
            > 
              {t("sales.list.refresh")}
            </Button>
            <Button 
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/app/pos")} 
              variant="contained" 
              color="success"
              sx={{ fontSize: 14, textTransform: 'none', fontWeight: 700 }}
            >
              {t("sales.list.newSale")}
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[ 
            { label: t("sales.list.totalRevenue"), value: `$${totalRevenue.toLocaleString()}`, color: "success" },
            { label: t("sales.list.transactions"), value: sales.length, color: "info" },
            { label: t("sales.list.averageTicket"), value: `$${averageTicket.toFixed(2)}`, color: "primary" },
            {label: t("sales.list.netProfit"), value: `$${netProfit.toLocaleString()}`, color: netProfit >= 0 ? "success" : "error"},
            {label: t("sales.list.margin"),value: `${profitMargin.toFixed(1)}%`,color: profitMargin >= 0 ? "success" : "error"}
 
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

        {/* Chart */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardHeader title={t("sales.list.revenueVsExpenses")} subheader={t("sales.list.dailyComparison")}
           />
          <CardContent>
            {chartData.categories.length > 0 ? (
              <Chart
                options={{
                  chart: { toolbar: { show: false }, background: 'transparent' },
                  theme: { mode: 'light' },
                 colors: ['#22c55e', '#ef4444'],
                  stroke: { curve: 'smooth', width: 3 },
                  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 90, 100] } },
                  xaxis: { 
                    categories: chartData.categories,
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                  },
                  yaxis: { labels: { formatter: (val) => `$${val.toLocaleString()}` } },
                  grid: { strokeDashArray: 4 },
                  tooltip: { y: { formatter: (val) => `$${val.toLocaleString()}` } },
                  markers: { size: 5, colors: ['#6366f1'], strokeWidth: 0 }
                }}
                series={[ 
                    {
                     name: t("sales.list.revenue"),
                     data: chartData.revenueSeries
                     },
                     {
                     name: t("sales.list.expenses"),
                     data: chartData.expenseSeries
                      }
                    ]}
                type="area"
                height={300}
              />
            ) : ( 
              <Box sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>{t("sales.list.noChartData")}</Box>
            )}
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardHeader title={t("sales.list.activityLog")} subheader={t("sales.list.activityDescription")} />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress size={40} />
              </Box>
            ) : sales.length === 0 ? (
              <EmptyState title={t("sales.list.emptyTitle")} description={t("sales.list.emptyDescription")} />
            ) : (
              <DataGridWrapper rows={rows} columns={columns} onRowClick={(params) => navigate(`/app/sales/${params.row._id}`)} />
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SalesPage;