import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { Box, Grid, Card, CardContent, CardHeader, Button, Chip, Container, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import API from "../../services/api";
import DataGridWrapper from "../../components/common/DataGridWrapper";
import EmptyState from "../../components/common/EmptyState";

interface Sale {
  _id: string;
  customer: { name: string; lastName: string } | string;
  total: number;
  status: "paid" | "pending" | "cancelled";
  createdAt: string;
  itemsCount: number;
}

const SalesPage = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadSales = async () => {
    try {
      setLoading(true);
      const res = await API.get("/sales");
      console.log("SALES RESPONSE:", res.data);
      const salesData = res.data?.data?.sales || res.data?.sales || res.data?.data || [];
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
  const pendingCount = sales.filter(s => s.status === 'pending').length;
  const averageTicket = sales.length > 0 ? totalRevenue / sales.length : 0;

  // Chart Data
  const chartData = useMemo(() => {
    const dailyData: { [key: string]: number } = {};
    const sortedSales = [...sales].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    sortedSales.forEach(sale => {
      const date = new Date(sale.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
      dailyData[date] = (dailyData[date] || 0) + sale.total;
    });
    return {
      categories: Object.keys(dailyData),
      series: Object.values(dailyData)
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
    { field: 'ref', headerName: 'Referencia', width: 140, renderCell: (params: any) => `#${params.row._id.slice(-8)}` },
    { field: 'customerName', headerName: 'Cliente', width: 200, renderCell: (params: any) => typeof params.row.customer === 'object' ? `${params.row.customer.name} ${params.row.customer.lastName}` : 'Consumidor Final' },
    { field: 'date', headerName: 'Fecha', width: 140, renderCell: (params: any) => new Date(params.row.createdAt).toLocaleDateString('es-ES') },
    { field: 'itemsCount', headerName: 'Items', width: 100, renderCell: (params: any) => `${params.row.itemsCount || 0} pzs` },
    { field: 'status', headerName: 'Estado', width: 130, renderCell: (params: any) => <Chip label={params.row.status} color={getStatusColor(params.row.status)} size="small" /> },
    { field: 'total', headerName: 'Total', width: 120, align: 'right' as const, renderCell: (params: any) => `$${params.row.total.toFixed(2)}` },
    { field: 'actions', headerName: 'Acciones', width: 120, align: 'center' as const, sortable: false, renderCell: (params: any) => (
      <Button size="small" variant="outlined" onClick={() => navigate(`/app/sales/${params.row._id}`)}>Detalles</Button>
    )}
  ];

  const rows = sales.map(s => ({ ...s, id: s._id }));


  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4, pb: 3, borderBottom: '2px solid #e0e7ff' }}>
          <Box>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Gestión de <span style={{ color: '#6366f1' }}>Ventas</span></h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Panel operativo de transacciones</p>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              startIcon={<RefreshIcon />}
              onClick={loadSales} 
              disabled={loading}
              variant="outlined"
              sx={{ fontSize: 14, textTransform: 'none' }}
            >
              Actualizar
            </Button>
            <Button 
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/app/pos")} 
              variant="contained" 
              color="success"
              sx={{ fontSize: 14, textTransform: 'none', fontWeight: 700 }}
            >
              Nueva Venta
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: "Ingresos Totales", value: `$${totalRevenue.toLocaleString()}`, color: "success" },
            { label: "Transacciones", value: sales.length, color: "info" },
            { label: "Pendientes", value: pendingCount, color: "warning" },
            { label: "Ticket Promedio", value: `$${averageTicket.toFixed(2)}`, color: "primary" },
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
          <CardHeader title="Tendencia de Ingresos" subheader="Evolución diaria de facturación" />
          <CardContent>
            {chartData.categories.length > 0 ? (
              <Chart
                options={{
                  chart: { toolbar: { show: false }, background: 'transparent' },
                  theme: { mode: 'light' },
                  colors: ['#6366f1'],
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
                series={[{ name: 'Ventas', data: chartData.series }]}
                type="area"
                height={300}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>No hay datos disponibles</Box>
            )}
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardHeader title="Registro de Actividad" subheader="Historial detallado de transacciones" />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress size={40} />
              </Box>
            ) : sales.length === 0 ? (
              <EmptyState title="Sin registros de venta" description="No hay ventas registradas aún." />
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