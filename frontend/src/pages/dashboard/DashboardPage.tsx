import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CircularProgress, Button } from '@mui/material';


// Features
import { useProducts } from '@/features/products';
import { useCustomers } from '@/features/customers';
import { useSales } from '@/features/sales';
import { useStockMovements } from '../../pages/stock/StockMovement';
import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartComponent } from '../../components/dashboard/BarChartComponent';
import { DonutChartComponent } from '../../components/dashboard/DonutChartComponent';
import { AreaChartComponent } from '../../components/dashboard/AreaChartComponent';
import { useTranslation } from 'react-i18next';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

const { products = [], loading: productsLoading } = useProducts();
const { customers = [], loading: customersLoading } = useCustomers();
const stockHook = useStockMovements();

const salesHook = useSales();

const sales = useMemo(() => {
  const rawSales = salesHook?.sales as any;
  if (Array.isArray(rawSales)) return rawSales; // Soporta array directo
  if (rawSales && Array.isArray(rawSales.data)) return rawSales.data; // Soporta { success, data }
  return []; // Devuelve array vacío si no hay datos válidos
}, [salesHook?.sales]); 

const movements = useMemo(() => {
  const rawMovements = stockHook?.movements as any;
  if (Array.isArray(rawMovements)) return rawMovements;
  if (rawMovements && typeof rawMovements === 'object' && 'data' in rawMovements && Array.isArray(rawMovements.data)) {
    return rawMovements.data;
  }
  return [];
}, [stockHook?.movements]);

const salesLoading = salesHook?.loading ?? false;
const stockLoading = stockHook?.loading ?? false;

const loading =
  productsLoading ||
  customersLoading ||
  salesLoading ||
  stockLoading;

  // ========================================================================
  // CALCULATE METRICS
  // ========================================================================
const metrics = useMemo(() => {
  const safeSales = Array.isArray(sales) ? sales : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCustomers = Array.isArray(customers) ? customers : [];
  const safeMovements = Array.isArray(movements) ? movements : [];

  // 1. GENERAR EJES DE TIEMPO PRIMERO (Evita errores de referencia)
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0); // Normalizar para comparación
    return d;
  });

  const monthLabels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(now.getMonth() - (5 - i));
    return {
      monthIdx: d.getMonth(),
      year: d.getFullYear(),
      label: monthLabels[d.getMonth()],
    };
  });

  // =========================
  // KPIs REALES
  // =========================
  const getSafeAmount = (s: any) => Number(s.totalAmount || s.total || 0);

  // Alineación con SalesPage: Solo ingresos 'paid'
  const totalRevenue = safeSales.reduce(
    (acc, s: any) => acc + (s.status === 'paid' ? getSafeAmount(s) : 0),
    0
  );

  // Gastos Totales: Costo de los productos en movimientos de salida (ventas, ajustes, etc.)
  const totalExpenses = safeMovements
    .filter((m: any) => m.type === 'out')
    .reduce((acc, m: any) => {
      // Asegurarse de que product y cost existen y son números
      const cost = Number(m.product?.cost || 0);
      const quantity = Number(m.quantity || 0);
      return acc + (cost * quantity);
    }, 0);
    
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Ventas de hoy (Normalización robusta)
  const todaySales = safeSales.filter((sale: any) => {
    const saleDate = new Date(sale.createdAt);
    return (
      saleDate.getFullYear() === now.getFullYear() &&
      saleDate.getMonth() === now.getMonth() &&
      saleDate.getDate() === now.getDate()
    );
  });

  const todayRevenue = todaySales.reduce(
    (acc, s: any) => acc + (s.status === 'paid' ? getSafeAmount(s) : 0),
    0
  );

  // Datos Mensuales (Revenue vs Expenses)
  const monthlyData = last6Months.map((m) => {
    return safeSales
      .filter((s) => {
        const sd = new Date(s.createdAt);
        return sd.getMonth() === m.monthIdx && sd.getFullYear() === m.year;
      })
      .reduce((acc, s: any) => acc + (s.status === 'paid' ? getSafeAmount(s) : 0), 0);
  });

  // Gastos Mensuales basados en movimientos de salida
  const monthlyExpenses = last6Months.map(m => {
    return safeMovements
      .filter((mov: any) => {
        const movDate = new Date(mov.timestamp);
        return mov.type === 'out' && movDate.getMonth() === m.monthIdx && movDate.getFullYear() === m.year;
      })
      .reduce((acc, mov: any) => {
        return acc + (Number(mov.product?.cost || 0) * Number(mov.quantity || 0));
      }, 0);
  });

  // Category distribution
  const categoriesMap: Record<string, number> = {};

  safeProducts.forEach((p) => {
    const cat =
      p.category && typeof p.category === "object"
        ? p.category.name
        : p.category || "Sin Categoría";

    categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
  });

  // Invoice status counts
  // Soporta: paid, pending, cancelled, completed, success
  const statusCounts = {
    paid: safeSales.filter(
      (s: any) => ["paid", "completed", "success"].includes(s.status?.toLowerCase())
    ).length,

    pending: safeSales.filter(
      (s: any) => ["pending"].includes(s.status?.toLowerCase())
    ).length,

    cancelled: safeSales.filter(
      (s: any) => ["cancelled"].includes(s.status?.toLowerCase())
    ).length,
  };

  // Critical Stock
  const criticalStock = safeProducts
    .filter((p) => (p.stock || 0) < 10)
    .slice(0, 5);

  // Top Customers by Debt
  const topDebtCustomers = [...safeCustomers]
    .filter((c) => (c.debt || 0) > 0)
    .sort((a, b) => (b.debt || 0) - (a.debt || 0))
    .slice(0, 5);

  // Datos Diarios (last 7 days)
  const dailyRevenue = last7Days.map(day => {
    return safeSales
      .filter(s => {
        const sd = new Date(s.createdAt);
        return isSameDay(sd, day);
      })
      .reduce((acc, s: any) => acc + (s.status === 'paid' ? getSafeAmount(s) : 0), 0);
  });

  // Gastos Diarios (last 7 days)
  const dailyExpenses = last7Days.map(day => {
    return safeMovements
      .filter(m => m.type === 'out' && isSameDay(new Date(m.timestamp), day))
      .reduce((acc, m: any) => {
        return acc + (Number(m.product?.cost || 0) * Number(m.quantity || 0));
      }, 0);
  });

  return {
    todayRevenue,
    totalRevenue,
    totalExpenses,
    netProfit,
    profitMargin,
    activeCustomers: safeCustomers.length,
    totalProducts: safeProducts.length,
    totalInvoices: safeSales.length,
    
    // Para el gráfico de Ingresos vs Gastos Mensual
    monthlyComparison: {
      categories: last6Months.map((m) => m.label),
      series: [
        { name: "Ingresos", data: monthlyData },
        { name: "Gastos", data: monthlyExpenses }
      ],
    },

    productCategories: {
      series: Object.values(categoriesMap),
      labels: Object.keys(categoriesMap),
    },

    invoiceStatus: {
      categories: ["Pagadas", "Pendientes", "Canceladas"],
      series: [
        {
          name: "Facturas",
          data: [
            statusCounts.paid,
            statusCounts.pending,
            statusCounts.cancelled,
          ],
        },
      ],
    },
    
dailySales: {
  categories: last7Days.map(d =>
    d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit"
    })
  ),

  series: [
    {
      name: "Ingresos",
      data: dailyRevenue
    },
    {
      name: "Gastos",
      data: dailyExpenses // AHORA COINCIDE CON 7 ELEMENTOS
    }
  ]
},
    topCustomersByDebt: {
      categories: topDebtCustomers.map((c) => c.name),
      series: [
        {
          name: "Deuda",
          data: topDebtCustomers.map((c) => c.debt || 0),
        },
      ],
    },

    criticalStock,
  };
}, [sales, products, customers, movements]);

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
        py: { xs: 2, md: 4 },
        overflow: 'hidden',
       }}
   >
      <Box sx={{ 
        mb: 4, 
        p: { xs: 2.5, md: 3 }, 
        borderRadius: 4, 
        background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(14,165,233,0.06))', 
        border: '1px solid', 
        borderColor: 'divider' 
      }}>
        <Typography variant="overline" sx={{ color: 'blue', fontWeight: 700, letterSpacing: 1.8, display: 'block' }}>
          {t("dashboard.welcome")}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'blue', mt: 1 }}>
          📊 {t("dashboard.title")}
        </Typography>
        <Typography variant="body2" sx={{ color: '#ffffff', mt: 1 }}>
          {t("dashboard.subtitle")} — {new Date().toLocaleString()}
        </Typography>
      </Box>

      {/* KPI ROW 1 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
            lg: '1fr 1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title={t("dashboard.todaySales")}
          value={`$${metrics.todayRevenue.toLocaleString()}`}
          icon="💰"
          color="#6366f1"
          trend={{ value: 12.5, direction: 'up' }}
        />

        <StatCard
          title={t("dashboard.totalCustomers")}
          value={metrics.activeCustomers.toString()}
          icon="👥"
          color="#3b82f6"
          trend={{ value: 8.2, direction: 'up' }}
        />

        <StatCard
          title={t("dashboard.totalProducts")}
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
            lg: '1fr 1fr 1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <StatCard
          title={t("dashboard.totalSales")}
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon="📈"
          color="#f59e0b"
          trend={{ value: 24.3, direction: 'up' }}
        />

        <StatCard
          title={t("dashboard.operations")}
          value={metrics.totalInvoices.toString()}
          icon="🧾"
          color="#ec4899"
          trend={{ value: 5.7, direction: 'up' }}
        />

       <StatCard
        title={t("dashboard.netProfit")}
         value={`$${metrics.netProfit.toLocaleString()}`}
         icon="💵"
         color="#8b5cf6"
         trend={{
         value: Number(metrics.profitMargin.toFixed(1)),
         direction:
         metrics.netProfit >= 0
           ? "up"
            : "down"
           }}
         />

         <StatCard
          title={t("dashboard.totalExpenses")}
          value={`$${metrics.totalExpenses.toLocaleString()}`}
          icon="💸"
          color="#ef4444"
         trend={{ value: 0, direction: "up" }}
/>
      </Box>

      {/* CHARTS ROW 1 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
       <AreaChartComponent
              title={`📈 ${t("dashboard.monthlySales")}`}
             series={[
            {
            name: "Ventas",
         data: metrics.monthlyComparison.series[0].data as number[]  
        }
      ]}
     categories={metrics.monthlyComparison.categories}
      />

        <DonutChartComponent
          title={`🛒 ${t("dashboard.topProducts")}`}
          series={metrics.productCategories.series as number[]}
          labels={metrics.productCategories.labels}
        />
      </Box>

      {/* CHARTS ROW 2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },
          gap: 3,
          mb: 4,
        }}
      >
        <BarChartComponent
          title={`💵 ${t("dashboard.incomeVsExpenses")}`}
          series={metrics.monthlyComparison.series}
          categories={metrics.monthlyComparison.categories}
        />

        <AreaChartComponent
         title={`💰 ${t("dashboard.dailyIncome")}`}
         series={metrics.dailySales.series}
         categories={metrics.dailySales.categories}
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
           title={t("dashboard.topCustomersDebt")}
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
            lg: '2fr 1fr',
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
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 4,
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              📦 Stock Crítico
            </Typography>
            <Button
              onClick={() => navigate('/app/stock/critical')}
              sx={{ textTransform: 'none' }}
            >
              Gestionar Alertas
            </Button>
          </Box>

          {metrics.criticalStock.map((product) => (
            <Box
              key={product._id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.25,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-of-type': { borderBottom: 0, pb: 0 },
                '&:first-of-type': { pt: 0 },
              }}
            >
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                {product.name}
              </Typography>

              <Typography
                sx={{
                  color: 'error.main',
                  fontWeight: 600,
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