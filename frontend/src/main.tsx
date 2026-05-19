import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './styles/index.css'
import { registerServiceWorker } from './pwa/registerServiceWorker'
import './styles/index.css'

// layouts
import Layout from "./components/layout/Layout";
import PublicLayout from "./components/public/PublicLayout";

// pages
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SalesReportPage from "./pages/reports/SalesReportPage";
import CustomersPage from "./pages/customers/CustomersPage";
import StockMovementsPage from "./pages/stock/StockMovementsPage";

// features
import ProductsPage from "./features/products/ProductsPage";
import UsersPage from "./features/users/UsersPage";
import SalesPage from "./features/sales/SalesStats";

// extras
import { FormDemo } from "./pages/FormDemo/FormDemo";
import ReduxDemoPage from "./pages/redux-demo";

// guards
import { RoleGuard } from "./components/auth/RoleGuard";


// auth
import { AuthProvider } from "./features/auth/AuthContext";

// errors
import NotFound from "./components/common/NotFound";
import ErrorPage from "./components/common/ErrorPage";


export const router = createBrowserRouter([

  // =========================
  // 🌍 PUBLIC ROUTES
  // =========================
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },


      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      { path: "contact", element: <ContactPage /> },
      { path: "about", element: <AboutPage /> },

      { path: "form-demo", element: <FormDemo /> },
      { path: "redux-demo", element: <ReduxDemoPage /> },
    ],
  },

  // =========================
  // 🔐 PRIVATE ROUTES
  // =========================
  {
    path: "/app", // 🔥 CLAVE: separar namespace
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [

      {
        index: true,
        element: (
          <RoleGuard roles={["superadmin", "admin", "employee"]}>
            <DashboardPage />
          </RoleGuard>
        ),
      },

      {
        path: "dashboard",
        element: (
          <RoleGuard roles={["superadmin", "admin", "employee"]}>
            <DashboardPage />
          </RoleGuard>
        ),
      },

      {
        path: "products",
        element: (
          <RoleGuard roles={["superadmin", "admin", "employee"]}>
            <ProductsPage />
          </RoleGuard>
        ),
      },

      {
        path: "users",
        element: (
          <RoleGuard roles={["superadmin", "admin"]}>
            <UsersPage />
          </RoleGuard>
        ),
      },

      {
        path: "sales",
        element: (
          <RoleGuard roles={["superadmin", "admin", "employee"]}>
            <SalesPage />
          </RoleGuard>
        ),
      },

      // FORMS
      {
        path: "customers/new",
        element: (
          <RoleGuard roles={["superadmin", "admin", "employee"]}>
            <CustomersPage />
          </RoleGuard>
        ),
      },

      {
        path: "products/new",
        element: (
          <RoleGuard roles={["superadmin", "admin"]}>
            <ProductsPage />
          </RoleGuard>
        ),
      },

      {
        path: "sales/new",
        element: (
          <RoleGuard roles={["superadmin", "admin", "employee"]}>
            <SalesPage />
          </RoleGuard>
        ),
      },

      {
        path: "stock/new",
        element: (
          <RoleGuard roles={["superadmin", "admin"]}>
            <StockMovementsPage/>
          </RoleGuard>
        ),
      },

      // REPORTS
      {
        path: "reports/sales",
        element: (
          <RoleGuard roles={["superadmin", "admin"]}>
            <SalesReportPage />
          </RoleGuard>
        ),
      },

      // 404 PRIVATE
      { path: "*", element: <NotFound /> },
    ],
  },

  // =========================
  // 🌐 GLOBAL 404
  // =========================
  {
    path: "*",
    element: <NotFound />,
  },

]);

// =========================
// 🚀 RENDERIZAR APLICACIÓN
// =========================
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

registerServiceWorker();

