import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { StatCard } from '../../components/dashboard/StatCard';
import { BarChartComponent } from '../../components/dashboard/BarChartComponent';
import { LineChartComponent } from '../../components/dashboard/LineChartComponent';
import { DonutChartComponent } from '../../components/dashboard/DonutChartComponent';
import { AreaChartComponent } from '../../components/dashboard/AreaChartComponent';

export default function DashboardPage() {
  const salesByMonth = {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    series: [
      {
        name: 'Ventas',
        data: [12450, 15680, 18920, 16450, 21300, 24560],
      },
    ],
  };

  const revenueVsExpenses = {
    categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    series: [
      {
        name: 'Ingresos',
        data: [28000, 32000, 35000, 38000],
      },
      {
        name: 'Gastos',
        data: [12000, 14000, 16000, 18000],
      },
    ],
  };

  const productSales = {
    series: [30, 25, 20, 15, 10],
    labels: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Otros'],
  };

  const invoiceStatus = {
    categories: ['Pagadas', 'Pendientes', 'Vencidas', 'Canceladas'],
    series: [
      {
        name: 'Facturas',
        data: [85, 35, 12, 18],
      },
    ],
  };

  const dailyRevenue = {
    categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    series: [
      {
        name: 'Ingresos Diarios',
        data: [4200, 5100, 4800, 6300, 7200, 8100, 5900],
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          value="$12,450"
          icon="💰"
          color="#6366f1"
          trend={{ value: 12.5, direction: 'up' }}
        />

        <StatCard
          title="Clientes Activos"
          value="128"
          icon="👥"
          color="#3b82f6"
          trend={{ value: 8.2, direction: 'up' }}
        />

        <StatCard
          title="Productos"
          value="342"
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
          value="$234,560"
          icon="📈"
          color="#f59e0b"
          trend={{ value: 24.3, direction: 'up' }}
        />

        <StatCard
          title="Facturas Emitidas"
          value="156"
          icon="🧾"
          color="#ec4899"
          trend={{ value: 5.7, direction: 'down' }}
        />

        <StatCard
          title="Ingresos vs Gastos"
          value="$92,340"
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
          series={salesByMonth.series}
          categories={salesByMonth.categories}
        />

        <DonutChartComponent
          title="🛒 Ventas por Categoría"
          series={productSales.series}
          labels={productSales.labels}
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
          series={revenueVsExpenses.series}
          categories={revenueVsExpenses.categories}
        />

        <AreaChartComponent
          title="💰 Ingresos Diarios"
          series={dailyRevenue.series}
          categories={dailyRevenue.categories}
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
          series={invoiceStatus.series}
          categories={invoiceStatus.categories}
        />

        <Box
          sx={{
            p: 3,
            border: '1px solid #2b2d31',
            borderRadius: 3,
            backgroundColor: '#111827',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#e4e2e4',
              mb: 2,
              fontWeight: 600,
            }}
          >
            📦 Stock Crítico
          </Typography>

          {['Producto A', 'Producto B', 'Producto C'].map((product) => (
            <Box
              key={product}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                py: 1.5,
              }}
            >
              <Typography sx={{ color: '#9ca3af' }}>
                {product}
              </Typography>

              <Typography
                sx={{
                  color: '#ef4444',
                  fontWeight: 700,
                }}
              >
                35%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}