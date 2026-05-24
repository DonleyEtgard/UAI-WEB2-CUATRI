// ============================================================================
// APP ROUTER - Centralized Routing System
// ============================================================================

import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// LAYOUTS
import Layout from "../components/layout/Layout";
import PublicLayout from "../components/public/PublicLayout";

// GUARDS
import { RoleGuard } from "../components/auth/RoleGuard";

// PAGES
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ContactPage from "../pages/contact";
import AboutPage from "../pages/about";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ProductsPage from "../features/products/ProductsPage";
import SalesPage from "../pages/sales/SalesPage";
import SalesDetailsPage from "../pages/sales/SaleDetailPage";
import SalesReportPage from "../pages/sales/SalesReportPage";
import CustomersPage from "../pages/customers/CustomersPage";
import MovementsPage from "../pages/stock/StockMovementsPage";
import UserPage from "../pages/users/UserPage";
import UserRolePage from "../pages/users/UserRolePage";
import { FormDemo } from "../pages/FormDemo/FormDemo";
import ReduxDemoPage from "../pages/redux-demo";
import NotFound from "../components/common/NotFound";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="form-demo" element={<FormDemo />} />
            <Route path="redux-demo" element={<ReduxDemoPage />} />
          </Route>

          {/* PRIVATE ROUTES */}
          <Route path="/app" element={<Layout />}>
            {/* Dashboard */}
            <Route
              index
              element={
                <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                  <DashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="dashboard"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                  <DashboardPage />
                </RoleGuard>
              }
            />

            {/* Products */}
            <Route
              path="products"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                  <ProductsPage />
                </RoleGuard>
              }
            />

            {/* Sales */}
            <Route path="sales">
              <Route
                index
                element={
                  <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                    <SalesPage />
                  </RoleGuard>
                }
              />
              <Route
                path="details/:id"
                element={
                  <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                    <SalesDetailsPage />
                  </RoleGuard>
                }
              />
            </Route>

            {/* Reports */}
            <Route
              path="reports"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin"]}>
                  <DashboardPage />
                </RoleGuard>
              }
            />
            <Route
              path="reports/sales"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin"]}>
                  <SalesReportPage />
                </RoleGuard>
              }
            />

            {/* Customers */}
            <Route path="clients" element={<Navigate to="/app/customers" replace />} />
            <Route
              path="customers"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                  <CustomersPage />
                </RoleGuard>
              }
            />

            {/* Stock */}
            <Route
              path="stock"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin"]}>
                  <MovementsPage />
                </RoleGuard>
              }
            />

            {/* Users */}
            <Route
              path="users"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin"]}>
                  <UserPage />
                </RoleGuard>
              }
            />
            <Route
              path="users/roles"
              element={
                <RoleGuard requiredRoles={["superadmin", "admin"]}>
                  <UserRolePage />
                </RoleGuard>
              }
            />

            {/* Private 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* GLOBAL REDIRECTS */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
