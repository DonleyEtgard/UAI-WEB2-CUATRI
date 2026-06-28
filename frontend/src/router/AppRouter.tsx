import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "../components/public/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// GUARDS
import { AuthGuard, RoleGuard } from "../components/auth/RoleGuard";
import { VerifiedGuard } from "../firebase/VerifiedGuard";
import VerifyEmailPage from "../firebase/VerifyEmailPage";

// PUBLIC PAGES
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ContactPage from "../pages/contact";
import AboutPage from "../pages/about";
import { FormDemo } from "../pages/FormDemo/FormDemo";
import ReduxDemoPage from "../pages/redux-demo";
import SettingsPage from "@/components/layout/SettingsPage"; 

import AuditLogPage from "@/components/layout/AuditLogPage"; 


// PRIVATE PAGES
import Dashboard from "../pages/dashboard/DashboardPage";
import ProductsPage from "../pages/products/ProductsPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";
import SalesPage from "../pages/sales/SalesPage";
import SaleDetailPage from "../pages/sales/SaleDetailPage";
import CustomersPage from "../pages/customers/CustomersPage";
import CustomerDetail from "../pages/customers/CustomerDetail";
import CustomerForm from "../pages/customers/CustomerForm";
import StockMovement from "../pages/stock/StockMovement";
import UserPage from "../pages/users/UserPage";
import UserDetailPage from "../pages/users/userDetailPage";
import UserRolePage from "../pages/users/UserRolePage";
import PaymentPage from "../pages/payment/PaymentPage";
import ReportsPage from "../pages/reports/ReportsPage";
import SaleFormPage from "../pages/sales/SaleFormPage";
import POSPage from "../features/sales/POSPage";
import TicketPage from "../pages/sales/TicketPage";
import CriticalStockPage from "../pages/stock/CriticalStockPage"; 



// COMMON
import NotFound from "../components/common/NotFound";
import ProductFormPage from "@/pages/products/ProductFormPage";
import UserForm from "@/pages/users/UserForm";
import StockMovementForm from "@/pages/stock/StockMovementForm";

// ============================================================================
// LOADING
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
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="form-demo" element={<FormDemo />} />
          <Route path="redux-demo" element={<ReduxDemoPage />} />
        </Route>

        {/* ================= PRIVATE ================= */}
        <Route
          path="/app"
          element={
            <AuthGuard>
              <VerifiedGuard>
                <DashboardLayout />
              </VerifiedGuard>
            </AuthGuard>
          }
        >

          {/* DASHBOARD */}
          <Route index element={<Navigate to="/app/dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <Dashboard />
              </RoleGuard>
            }
          />

          {/* PRODUCTS */}
          <Route
            path="products"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <ProductsPage />
              </RoleGuard>
            }
          />

          <Route
            path="products/new"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <ProductFormPage />
              </RoleGuard>
            }
          />

          <Route
            path="products/:id"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <ProductDetailPage />
              </RoleGuard>
            }
          />
          
          <Route
             path="/app/products/edit/:id"
           element={
             <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
           <ProductFormPage />
           </RoleGuard>
           }

          />

          {/* SALES */}
          <Route
            path="sales"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <SalesPage />
              </RoleGuard>
            }
          />
          

          <Route
            path="sales/:id"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <SaleDetailPage />
              </RoleGuard>
            }
          />

          <Route
           path="sales/ticket/:id"
           element={
           <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
           <TicketPage />
           </RoleGuard>
          }
          />

          <Route
            path="sales/new"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <SaleFormPage />
              </RoleGuard>
            }
          />

          <Route
            path="pos"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <POSPage />
              </RoleGuard>
            }
          />

          {/* CUSTOMERS */}
          <Route
            path="customers"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <CustomersPage />
              </RoleGuard>
            }
          />
          <Route
            path="customers/new"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <CustomerForm />
              </RoleGuard>
            }
          />
          <Route
            path="customers/:id"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <CustomerDetail />
              </RoleGuard>
            }
          />

          <Route
           path="customers/edit/:id"
           element={
           <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
           <CustomerForm />
          </RoleGuard>
        }
       />

          {/* STOCK (admin + superadmin + employee) */}
          <Route
            path="stock"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <StockMovement />
              </RoleGuard>
            }
          />

          <Route
            path="stock/critical"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <CriticalStockPage />
              </RoleGuard>
            }
          />

          <Route
            path="stock/movement/new"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin", "employee"]}>
                <StockMovementForm />
              </RoleGuard>
            }
          />

          {/* USERS (IMPORTANTE: superadmin incluido correctamente) */}
          <Route
            path="users"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin"]}>
                <UserPage />
              </RoleGuard>
            }
          />
           <Route
          path="users/:id"
          element={
          <RoleGuard requiredRoles={["superadmin", "admin"]}>
         <UserDetailPage />
        </RoleGuard>
       }
      />
      
       
          <Route
            path="users/new"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin"]}>
                <UserForm />
              </RoleGuard>
            }
          />

          <Route
            path="users/edit/:id"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin"]}>
                <UserForm />
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

          {/* SUBSCRIPTION */}
          <Route
            path="subscription"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin"]}>
                <PaymentPage />
              </RoleGuard>
            }
          />

          {/* SETTINGS */}
          <Route
            path="settings"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin"]}>
                <SettingsPage />
              </RoleGuard>
            }
          />

          {/* AUDIT LOG */}
          <Route
            path="audit-log"
            element={
              <RoleGuard requiredRoles={["superadmin", "admin"]}>
                <AuditLogPage />
              </RoleGuard>
            }
          />
        </Route>

        {/* ================= PRIVATE (NO LAYOUT) ================= */}
        {/* REPORTS */}
        <Route
          path="/app/reports/sales"
          element={
            <AuthGuard>
              <VerifiedGuard>
                <RoleGuard requiredRoles={["superadmin", "admin"]}>
                  <ReportsPage />
                </RoleGuard>
              </VerifiedGuard>
            </AuthGuard>
          }
        />

        {/* ================= GLOBAL 404 ================= */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />

      </Routes>
    </Suspense>
  );
};

export default AppRouter;