// ============================================================================
// ROLE GUARD - Route Protection based on User Roles
// ============================================================================

import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/auth";

// ============================================================================
// TYPES
// ============================================================================

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  fallback?: React.ReactNode;
}

// ============================================================================
// LOADING FALLBACK
// ============================================================================

const LoadingScreen: React.FC = () => (
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
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-slate-300">Loading...</p>
    </div>
  </div>
);

/**
 * Unauthorized access screen
 */
const UnauthorizedScreen: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-2">Access Denied</h1>
      <p className="text-slate-400 mb-6">You don't have permission to access this resource</p>
      <Link
        to="/app/dashboard"
        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

// ============================================================================
// ROLE GUARD COMPONENT
// ============================================================================

/**
 * Guard component to protect routes based on user roles
 * @param children - Component to render if user has required roles
 * @param requiredRoles - Array of roles allowed to access this route
 * @param fallback - Custom fallback component (default: UnauthorizedScreen)
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles,
  fallback,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // ========================================================================
  // LOADING STATE
  // ========================================================================

  if (isLoading) {
    return <LoadingScreen />;
  }

  // ========================================================================
  // NOT AUTHENTICATED
  // ========================================================================

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ========================================================================
  // ROLE CHECK
  // ========================================================================

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(user.role);

    if (!hasRequiredRole) {
      return fallback ? <>{fallback}</> : <UnauthorizedScreen />;
    }
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return <>{children}</>;
};

// ============================================================================
// SPECIFIC ROLE GUARDS
// ============================================================================

/**
 * SuperAdmin guard - only superadmins can access
 */
export const SuperAdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard requiredRoles={["superadmin"]}>{children}</RoleGuard>
);

/**
 * Admin guard - admins and superadmins can access
 */
export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard requiredRoles={["admin", "superadmin"]}>{children}</RoleGuard>
);

/**
 * Employee guard - all roles can access
 */
export const EmployeeGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RoleGuard requiredRoles={["employee", "admin", "superadmin"]}>{children}</RoleGuard>
);

/**
 * Authenticated guard - any authenticated user can access
 */
export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
