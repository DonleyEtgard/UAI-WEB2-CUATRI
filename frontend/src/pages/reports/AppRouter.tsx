import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard, AdminGuard } from "../../components/auth/RoleGuard";
import DashboardLayout from "../../layouts/DashboardLayout";

// Pages
import DashboardPage from "../dashboard/DashboardPage";
import SalesReportPage from "../sales/SalesReportPage";
import UserPage from "../users/UserPage";
import UserRolesPage from "../users/UserRolePage";
import MovementsPage from "../stock/StockMovementsPage";
import CustomersPage from "../customers/CustomersPage";
import SalesDetailsPage from "../sales/SaleDetailPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Navigate to="/app" />} />
      
      {/* Rutas Privadas /app */}
      <Route
        path="/app"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        {/* Dashboard Principal */}
        <Route index element={<DashboardPage />} />

        {/* Gestión de Clientes (Corrigiendo 404) */}
        <Route path="clients" element={<CustomersPage />} />
        <Route path="customers" element={<CustomersPage />} />

        {/* Gestión de Inventario (Corrigiendo 404) */}
        <Route path="stock" element={<MovementsPage />} />

        {/* Reportes */}
        <Route path="reports" element={<DashboardPage />} />
        <Route path="reports/sales" element={<SalesReportPage />} />

        {/* Ventas */}
        <Route path="sales/details" element={<SalesDetailsPage />} />

        {/* Administración (Admin/SuperAdmin) */}
        <Route path="users" element={<AdminGuard><UserPage /></AdminGuard>} />
        <Route path="users/roles" element={<AdminGuard><UserRolesPage /></AdminGuard>} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={
        <div className="flex items-center justify-center min-h-screen bg-[#050816] text-white">
          <h1 className="text-xl">404 - Page not found</h1>
        </div>
      } />
    </Routes>
  );
};

export default AppRouter;