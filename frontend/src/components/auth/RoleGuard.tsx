import React from "react";
import {
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";

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

const LoadingScreen: React.FC = () => (
  <div
    className="
      flex items-center justify-center
      min-h-screen bg-slate-950
    "
  >
    <div className="text-center">
      <svg
        className="
          animate-spin
          h-12
          w-12
          text-indigo-500
          mx-auto
          mb-4
        "
        viewBox="0 0 24 24"
      >
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
          d="
            M4 12a8 8 0 018-8V0
            C5.373 0 0 5.373 0 12h4zm2 5.291
            A7.962 7.962 0 014 12H0
            c0 3.042 1.135 5.824
            3 7.938l3-2.647z
          "
        />
      </svg>

      <p className="text-slate-300">
        Verificando permisos...
      </p>
    </div>
  </div>
);

// ============================================================================
// UNAUTHORIZED SCREEN
// ============================================================================

const UnauthorizedScreen: React.FC = () => (
  <div
    className="
      flex items-center justify-center
      min-h-screen bg-slate-950
      px-4
    "
  >
    <div className="text-center max-w-md">
      <div className="text-6xl mb-4">
        🚫
      </div>

      <h1
        className="
          text-4xl
          font-bold
          text-red-500
          mb-3
        "
      >
        Access Denied
      </h1>

      <p
        className="
          text-slate-400
          mb-6
        "
      >
        No tienes permisos de accesos.
      </p>

      <Link
        to="/app/dashboard"
        className="
          inline-flex
          items-center
          justify-center
          px-6
          py-3
          rounded-xl
          bg-indigo-600
          hover:bg-indigo-700
          transition
          text-white
          font-semibold
        "
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

// ============================================================================
// ROLE GUARD
// ============================================================================

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRoles = [],
  fallback,
}) => {
  const {
    user,
    isLoading,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    console.log("[RoleGuard] isLoading", {
      pathname: location.pathname,
    });
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    console.log("[RoleGuard] redirect->/login", {
      pathname: location.pathname,
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role,
    });
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  // ==========================================================================
  // ROLE VALIDATION
  // ==========================================================================

  if (
    requiredRoles.length > 0 &&
    !requiredRoles.includes(user.role)
  ) {
    console.log("[RoleGuard] role mismatch", {
      pathname: location.pathname,
      requiredRoles,
      userRole: user.role,
    });
    return fallback
      ? <>{fallback}</>
      : <UnauthorizedScreen />;
  }


  // ==========================================================================
  // AUTHORIZED
  // ==========================================================================

  return <>{children}</>;
};

// ============================================================================
// PREDEFINED GUARDS
// ============================================================================

interface GuardChildrenProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------------
// SUPERADMIN
// ----------------------------------------------------------------------------

export const SuperAdminGuard: React.FC<
  GuardChildrenProps
> = ({ children }) => (
  <RoleGuard
    requiredRoles={[
      "superadmin",
    ]}
  >
    {children}
  </RoleGuard>
);

// ----------------------------------------------------------------------------
// ADMIN
// ----------------------------------------------------------------------------

export const AdminGuard: React.FC<
  GuardChildrenProps
> = ({ children }) => (
  <RoleGuard
    requiredRoles={[
      "admin",
      "superadmin",
    ]}
  >
    {children}
  </RoleGuard>
);

// ----------------------------------------------------------------------------
// EMPLOYEE
// ----------------------------------------------------------------------------

export const EmployeeGuard: React.FC<
  GuardChildrenProps
> = ({ children }) => (
  <RoleGuard
    requiredRoles={[
      "employee",
      "admin",
      "superadmin",
    ]}
  >
    {children}
  </RoleGuard>
);

// ----------------------------------------------------------------------------
// AUTH ONLY
// ----------------------------------------------------------------------------

export const AuthGuard: React.FC<
  GuardChildrenProps
> = ({ children }) => {
  const {
    user,
    firebaseUser,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!firebaseUser || !user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
