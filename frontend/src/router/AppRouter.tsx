// ============================================================================
// APP ROUTER - Professional React Router v7 Setup
// ============================================================================

import React, { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ============================================================================
// PAGES & COMPONENTS
// ============================================================================

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Guards
import {
  AuthGuard,
  SuperAdminGuard,
  AdminGuard,
} from "@/components/auth/RoleGuard";

// Layouts (create these based on your design)
// import DashboardLayout from "@/layouts/DashboardLayout";
// import AuthLayout from "@/layouts/AuthLayout";

// ============================================================================
// LOADING FALLBACK
// ============================================================================

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="text-center">
      <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
      </svg>
      <p className="text-slate-300">Loading...</p>
    </div>
  </div>
);

// ============================================================================
// PLACEHOLDER PAGES
// ============================================================================

const DashboardPage = () => (
  <div className="min-h-screen bg-slate-900 p-8">
    <h1 className="text-4xl font-bold text-white">Dashboard</h1>
    <p className="text-slate-400 mt-4">Welcome to your dashboard</p>
  </div>
);

const AdminPage = () => (
  <div className="min-h-screen bg-slate-900 p-8">
    <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
    <p className="text-slate-400 mt-4">Admin only area</p>
  </div>
);

const SuperAdminPage = () => (
  <div className="min-h-screen bg-slate-900 p-8">
    <h1 className="text-4xl font-bold text-white">SuperAdmin Panel</h1>
    <p className="text-slate-400 mt-4">SuperAdmin only area</p>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-slate-400 mb-8">Page not found</p>
      <a href="/dashboard" className="text-blue-400 hover:text-blue-300">
        Back to Dashboard
      </a>
    </div>
  </div>
);

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <p className="text-slate-400 mb-8">Access Denied</p>
      <a href="/dashboard" className="text-blue-400 hover:text-blue-300">
        Back to Dashboard
      </a>
    </div>
  </div>
);

// ============================================================================
// APP ROUTER COMPONENT
// ============================================================================

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ============================================================ */}
          {/* PUBLIC ROUTES */}
          {/* ============================================================ */}

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* ============================================================ */}
          {/* PROTECTED ROUTES - AUTHENTICATED */}
          {/* ============================================================ */}

          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            }
          />

          {/* ============================================================ */}
          {/* PROTECTED ROUTES - ADMIN ONLY */}
          {/* ============================================================ */}

          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminPage />
              </AdminGuard>
            }
          />

          {/* ============================================================ */}
          {/* PROTECTED ROUTES - SUPERADMIN ONLY */}
          {/* ============================================================ */}

          <Route
            path="/superadmin"
            element={
              <SuperAdminGuard>
                <SuperAdminPage />
              </SuperAdminGuard>
            }
          />

          {/* ============================================================ */}
          {/* ERROR ROUTES */}
          {/* ============================================================ */}

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* ============================================================ */}
          {/* CATCH ALL - REDIRECT */}
          {/* ============================================================ */}

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
