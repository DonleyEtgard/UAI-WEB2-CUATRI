// ============================================================================
// MAIN.TSX - Application Entry Point with Router + Auth Provider
// ============================================================================

import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./styles/index.css";

import { registerServiceWorker } from "./pwa/registerServiceWorker";

// ============================================================================
// LAYOUTS
// ============================================================================

import Layout from "./components/layout/Layout";
import PublicLayout from "./components/public/PublicLayout";

// ============================================================================
// PAGES
// ============================================================================

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SalesReportPage from "./pages/reports/SalesReportPage";
import CustomersPage from "./pages/customers/CustomersPage";
import StockMovementsPage from "./pages/stock/StockMovementsPage";

// ============================================================================
// FEATURES
// ============================================================================

import ProductsPage from "./features/products/ProductsPage";
import UsersPage from "./features/users/UsersPage";
import SalesPage from "./features/sales/SalesStats";

// ============================================================================
// EXTRAS
// ============================================================================

import { FormDemo } from "./pages/FormDemo/FormDemo";
import ReduxDemoPage from "./pages/redux-demo";

// ============================================================================
// GUARDS
// ============================================================================

import { RoleGuard } from "./components/auth/RoleGuard";

// ============================================================================
// AUTH
// ============================================================================

import { AuthProvider } from "./context/AuthContext";

// ============================================================================
// ERRORS
// ============================================================================

import NotFound from "./components/common/NotFound";
import ErrorPage from "./components/common/ErrorPage";

// ============================================================================
// ROUTER
// ============================================================================

export const router = createBrowserRouter([
  // ==========================================================================
  // 🌍 PUBLIC ROUTES
  // ==========================================================================

  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "login",
        element: <LoginPage />,
      },

      {
        path: "register",
        element: <RegisterPage />,
      },

      {
        path: "contact",
        element: <ContactPage />,
      },

      {
        path: "about",
        element: <AboutPage />,
      },

      {
        path: "form-demo",
        element: <FormDemo />,
      },

      {
        path: "redux-demo",
        element: <ReduxDemoPage />,
      },
    ],
  },

  // ==========================================================================
  // 🔐 PRIVATE ROUTES
  // ==========================================================================

  {
    path: "/app",
    element: <Layout />,
    errorElement: <ErrorPage />,

    children: [
      // DASHBOARD
      {
        index: true,

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
              "employee",
            ]}
          >
            <DashboardPage />
          </RoleGuard>
        ),
      },

      {
        path: "dashboard",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
              "employee",
            ]}
          >
            <DashboardPage />
          </RoleGuard>
        ),
      },

      // PRODUCTS
      {
        path: "products",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
              "employee",
            ]}
          >
            <ProductsPage />
          </RoleGuard>
        ),
      },

      // USERS
      {
        path: "users",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
            ]}
          >
            <UsersPage />
          </RoleGuard>
        ),
      },

      // SALES
      {
        path: "sales",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
              "employee",
            ]}
          >
            <SalesPage />
          </RoleGuard>
        ),
      },

      // CUSTOMERS
      {
        path: "customers/new",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
              "employee",
            ]}
          >
            <CustomersPage />
          </RoleGuard>
        ),
      },

      // NEW PRODUCT
      {
        path: "products/new",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
            ]}
          >
            <ProductsPage />
          </RoleGuard>
        ),
      },

      // NEW SALES
      {
        path: "sales/new",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
              "employee",
            ]}
          >
            <SalesPage />
          </RoleGuard>
        ),
      },

      // STOCK
      {
        path: "stock/new",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
            ]}
          >
            <StockMovementsPage />
          </RoleGuard>
        ),
      },

      // REPORTS
      {
        path: "reports/sales",

        element: (
          <RoleGuard
            requiredRoles={[
              "superadmin",
              "admin",
            ]}
          >
            <SalesReportPage />
          </RoleGuard>
        ),
      },

      // PRIVATE 404
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },

  // ==========================================================================
  // 🌐 GLOBAL 404
  // ==========================================================================

  {
    path: "*",
    element: <NotFound />,
  },
]);

// ============================================================================
// 🚀 APP RENDER
// ============================================================================

createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

// ============================================================================
// SERVICE WORKER
// ============================================================================

registerServiceWorker();