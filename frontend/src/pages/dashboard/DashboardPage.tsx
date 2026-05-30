import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Features
import { useProducts } from '@/features/products';
import { useCustomers } from '@/features/customers';
import { useSales } from '@/features/sales';

import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartComponent } from '../../components/dashboard/BarChartComponent';
import { LineChartComponent } from '../../components/dashboard/LineChartComponent';
import { DonutChartComponent } from '../../components/dashboard/DonutChartComponent';
import { AreaChartComponent } from '../../components/dashboard/AreaChartComponent';

export default function DashboardPage() {
  const navigate = useNavigate();
  // Usamos los hooks de los features para obtener datos con soporte offline
  const { products, loading: productsLoading } = useProducts();
  const { customers, loading: customersLoading } = useCustomers();
  const { sales, loading: salesLoading } = useSales();

  const loading = productsLoading || customersLoading || salesLoading;

  // ========================================================================
  // CALCULATE METRICS
  // ========================================================================
  const metrics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Basic KPIs
    const totalRevenue = sales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    const todaySales = sales.filter(s => s.createdAt?.startsWith(todayStr));
    const todayRevenue = todaySales.reduce((acc, s) => acc + (s.totalAmount || 0), 0);

    // Sales chart (last 6 months)
    const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(now.getMonth() - (5 - i));
      return { monthIdx: d.getMonth(), year: d.getFullYear(), label: monthLabels[d.getMonth()] };
    });

    const monthlyData = last6Months.map(m => {
      return sales
        .filter(s => {
          const sd = new Date(s.createdAt || '');
          return sd.getMonth() === m.monthIdx && sd.getFullYear() === m.year;
        })
        .reduce((acc, s) => acc + (s.totalAmount || 0), 0);
    });

    // Category distribution
    const categoriesMap: Record<string, number> = {};
    products.forEach(p => {
      const cat = typeof p.category === 'string' ? p.category : p.category?.name || 'Sin Categoría';
      categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
    });

    // Invoice status counts
    const statusCounts = {
      paid: sales.filter(s => s.status === 'completed').length,
      pending: sales.filter(s => s.status === 'pending').length,
      cancelled: sales.filter(s => s.status === 'cancelled').length,
    };

    // Critical Stock (stock < 10)
    const criticalStock = products
      .filter(p => (p.stock || 0) < 10)
      .slice(0, 5);

    // Top Customers by Debt
    const topDebtCustomers = [...customers]
      .filter(c => (c.debt || 0) > 0)
      .sort((a, b) => (b.debt || 0) - (a.debt || 0))
      .slice(0, 5);

    return {
      todayRevenue,
      totalRevenue,
      activeCustomers: customers.length,
      totalProducts: products.length,
      totalInvoices: sales.length,
      salesByMonth: {
        categories: last6Months.map(m => m.label),
        series: [{ name: 'Ventas', data: monthlyData }],
      },
      productCategories: {
        series: Object.values(categoriesMap),
        labels: Object.keys(categoriesMap),
      },
      invoiceStatus: {
        categories: ['Pagadas', 'Pendientes', 'Canceladas'],
        series: [{ name: 'Facturas', data: [statusCounts.paid, statusCounts.pending, statusCounts.cancelled] }],
      },
      topCustomersByDebt: {
        categories: topDebtCustomers.map(c => c.name),
        series: [{ name: 'Deuda', data: topDebtCustomers.map(c => c.debt || 0) }],
      },
      criticalStock,
    };
  }, [sales, products, customers]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
   <Container
       maxWidth="xl"
       sx={{
        py: 4,
          overflow: "hidden",
                }}
>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#e4e2e4',
          }}
        >
          📊 Dashboard
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#9ca3af',
          }}
        >
          Resumen general — {new Date().toLocaleString()}
        </Typography>
      </Box>

      {/* KPI ROW 1 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Ventas Hoy"
          value={`$${metrics.todayRevenue.toLocaleString()}`}
          icon="💰"
          color="#6366f1"
          trend={{ value: 12.5, direction: 'up' }}
        />

        <StatCard
          title="Clientes Totales"
          value={metrics.activeCustomers.toString()}
          icon="👥"
          color="#3b82f6"
          trend={{ value: 8.2, direction: 'up' }}
        />

        <StatCard
          title="Catálogo"
          value={metrics.totalProducts.toString()}
          icon="📦"
          color="#10b981"
          trend={{ value: 3.1, direction: 'up' }}
        />
      </Box>

      {/* KPI ROW 2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            md: '1fr 1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title="Ventas Totales"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="📈"
          color="#f59e0b"
          trend={{ value: 24.3, direction: 'up' }}
        />

        <StatCard
          title="Operaciones"
          value={metrics.totalInvoices.toString()}
          icon="🧾"
          color="#ec4899"
          trend={{ value: 5.7, direction: 'up' }}
        />

        <StatCard
          title="Ingresos vs Gastos"
          value={`$${(metrics.totalRevenue * 0.7).toLocaleString()}`}
          icon="💵"
          color="#8b5cf6"
          trend={{ value: 18.9, direction: 'up' }}
        />
      </Box>

      {/* CHARTS ROW 1 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <LineChartComponent
          title="📈 Ventas por Mes"
          series={metrics.salesByMonth.series}
          categories={metrics.salesByMonth.categories}
        />

        <DonutChartComponent
          title="🛒 Ventas por Categoría"
          series={metrics.productCategories.series}
          labels={metrics.productCategories.labels}
        />
      </Box>

      {/* CHARTS ROW 2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <BarChartComponent
          title="💵 Ingresos vs Gastos"
          series={metrics.salesByMonth.series}
          categories={metrics.salesByMonth.categories}
        />

        <AreaChartComponent
          title="💰 Ingresos Diarios"
          series={metrics.salesByMonth.series}
          categories={metrics.salesByMonth.categories}
        />
      </Box>

      {/* TOP DEBT CUSTOMERS ROW */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 3,
          mb: 4,
        }}
      >
        <BarChartComponent
          title="💳 Top Clientes por Deuda"
          series={metrics.topCustomersByDebt.series}
          categories={metrics.topCustomersByDebt.categories}
        />
      </Box>

      {/* CHARTS ROW 3 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '2fr 1fr',
          },
          gap: 3,
        }}
      >
        <BarChartComponent
          title="🧾 Estado de Facturas"
          series={metrics.invoiceStatus.series}
          categories={metrics.invoiceStatus.categories}
        />

        <Box
          sx={{
            p: 3,
            border: '1px solid #2b2d31',
            borderRadius: 3,
            backgroundColor: '#111827',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#e4e2e4',
                fontWeight: 600,
              }}
            >
              📦 Stock Crítico
            </Typography>
            <button 
              onClick={() => navigate('/app/stock/critical')}
              style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              Gestionar Alertas
            </button>
          </Box>

          {metrics.criticalStock.map((product) => (
            <Box
              key={product._id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1.5,
              }}
            >
              <Typography sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                {product.name}
              </Typography>

              <Typography
                sx={{
                  color: '#ef4444',
                  fontWeight: 700,
                }}
              >
                {product.stock} un.
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}