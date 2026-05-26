// ============================================================================
// APP ROUTER - FIXED & CLEAN VERSION
// ============================================================================

import React, { Suspense } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PublicLayout from "../components/public/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// GUARDS
import { AuthGuard, RoleGuard } from "../components/auth/RoleGuard";

// PUBLIC PAGES
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ContactPage from "../pages/contact";
import AboutPage from "../pages/about";
import { FormDemo } from "../pages/FormDemo/FormDemo";
import ReduxDemoPage from "../pages/redux-demo";

// PRIVATE PAGES
// Verifica si estos componentes usan 'export default'. Si no, cámbialos a { NamedImport }
import Dashboard from "../pages/dashboard/DashboardPage";

import ProductsPage from "../pages/products/ProductsPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";

import SalesPage from "../pages/sales/SalesPage";
import SaleDetailPage from "../pages/sales/SaleDetailPage";
import ReportsPage from "../pages/reports/ReportsPage"; 

import CustomersPage from "../pages/customers/CustomersPage";

import StockPage from "../pages/stock/StockPage";

import UserPage from "../pages/users/UserPage"; 
import UserRolePage from "../pages/users/UserRolePage";
import UserDetailPage from "../pages/users/UserDetailPage";

// COMMON
import NotFound from "../components/common/NotFound";

// ============================================================================
// LOADING FALLBACK
// ============================================================================

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

// ============================================================================
// ROUTER
// ============================================================================

export const AppRouter: React.FC = () => {
  // NOTA: Si el sitio te redirige de "/" a "/app" automáticamente,
  // busca en PublicLayout.tsx o HomePage.tsx y elimina la línea:
  // if (isAuthenticated) return <Navigate to="/app/dashboard" />

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>

        {/* ================================================================= */}
        {/* PUBLIC ROUTES */}
        {/* ================================================================= */}

        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />

          <Route path="form-demo" element={<FormDemo />} />
          <Route path="redux-demo" element={<ReduxDemoPage />} />
        </Route>

        {/* ================================================================= */}
        {/* PRIVATE ROUTES */}
        {/* ================================================================= */}

        <Route
          path="/app"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }>

          {/* =============================================================== */}
          {/* DASHBOARD */}
          {/* =============================================================== */}

          <Route
            index
            element={<Navigate to="/app/dashboard" replace />}
          />

          <Route
            path="dashboard"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                  "employee",
                ]}
              >
                <Dashboard />
              </RoleGuard>
            }
          />

          {/* =============================================================== */}
          {/* PRODUCTS */}
          {/* =============================================================== */}


          <Route
            path="products"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                  "employee",
                ]}
              >
                <ProductsPage />
              </RoleGuard>
            }
          />

          <Route
            path="products/:id"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                  "employee",
                ]}
              >
                <ProductDetailPage />
              </RoleGuard>
            }
          />

          {/* =============================================================== */}
          {/* SALES */}
          {/* =============================================================== */}

          <Route
            path="sales"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                  "employee",
                ]}
              >
                <SalesPage />
              </RoleGuard>
            }
          />

          <Route
            path="sales/:id"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                  "employee",
                ]}
              >
                <SaleDetailPage />
              </RoleGuard>
            }
          />

          {/* =============================================================== */}
          {/* REPORTS */}
          {/* =============================================================== */}

          <Route
            path="reports/sales"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                ]}
              >
                <ReportsPage />
              </RoleGuard>
            }
          />

          {/* =============================================================== */}
          {/* CUSTOMERS */}
          {/* =============================================================== */}

          <Route
            path="customers"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                  "employee",
                ]}
              >
                <CustomersPage />
              </RoleGuard>
            }
          />

          {/* Alias y redirecciones de compatibilidad */}
          <Route
            path="clients"
            element={
              <Navigate 
                to="/app/customers"
                replace
              />
            }
          />

          {/* =============================================================== */}
          {/* STOCK */}
          {/* =============================================================== */}

          <Route
            path="stock"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                ]}
              >
                <StockPage />
              </RoleGuard>
            }
          />

          {/* =============================================================== */}
          {/* USERS */}
          {/* =============================================================== */}

          <Route
            path="users"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                ]}
              >
                <UserPage />
              </RoleGuard>
            }
          />

          <Route
            path="users/:id"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                ]}
              >
                <UserDetailPage />
              </RoleGuard>
            }
          />

          <Route
            path="users/roles"
            element={
              <RoleGuard
                requiredRoles={[
                  "superadmin",
                  "admin",
                ]}
              >
                <UserRolePage />
              </RoleGuard>
            }
          />

          {/* =============================================================== */}
          {/* PRIVATE 404 */}
          {/* =============================================================== */}

          {/* NotFound del bloque /app se maneja a nivel global */}
        </Route>

        {/* ================================================================= */}
        {/* GLOBAL ROUTES */}
        {/* ================================================================= */}

        <Route
          path="/404"
          element={<NotFound />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/404"
              replace
            />
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;