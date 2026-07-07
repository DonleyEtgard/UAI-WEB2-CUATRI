// ============================================================================
// USAGE EXAMPLES - Real-world Implementation Guide
// ============================================================================

/**
 * EXAMPLE 1: Simple Protected Component
 */

import { useAuth } from "@/context/AuthContext";

export function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>{user.name} {user.lastName}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Plan: {user.plan}</p>
    </div>
  );
}

// ============================================================================
/**
 * EXAMPLE 2: Admin Dashboard with Role Check
 */

import { useHasAnyRole } from "@/context/AuthContext";

export function AdminDashboard() {
  const isAdmin = useHasAnyRole(["admin", "superadmin"]);

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <UsersList />
      <StatisticsPanel />
    </div>
  );
}

// ============================================================================
/**
 * EXAMPLE 3: Dynamic Navigation based on Role
 */

import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export function Navigation() {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>

      {user?.role === "admin" && (
        <Link to="/admin">Admin Panel</Link>
      )}

      {user?.role === "superadmin" && (
        <>
          <Link to="/admin">Admin Panel</Link>
          <Link to="/superadmin">SuperAdmin Panel</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </nav>
  );
}

// ============================================================================
/**
 * EXAMPLE 4: API Call with Bearer Token
 */

import { apiClient } from "@/config/api";

export async function fetchUsersList() {
  try {
    // Token se añade automáticamente por el interceptor
    const response = await apiClient.get("/users");
    return response.data.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// ============================================================================
/**
 * EXAMPLE 5: Protected API Call with Error Handling
 */

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function DeleteUserButton({ userId }: { userId: string }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only superadmin can delete
  if (user?.role !== "superadmin") {
    return <button disabled>Only SuperAdmin can delete</button>;
  }

  const handleDelete = async () => {
    try {
      setError(null);
      setLoading(true);

      // API call with Bearer token (automatic)
      await apiClient.delete(`/users/${userId}`);

      alert("User deleted successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Error deleting user";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete User"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}

// ============================================================================
/**
 * EXAMPLE 6: Form with Protected Submission
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/config/api";

export function UpdateProfileForm() {
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await apiClient.patch(`/users/${user?._id}`, formData);
      alert("Profile updated successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="First Name"
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        placeholder="Last Name"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}

// ============================================================================
/**
 * EXAMPLE 7: Backend Endpoint with Role Authorization
 */

// In: src/routes/products/index.ts

import express from "express";
import { authenticateFirebase } from "@/middlewares/authenticateFirebase";
import { authorizeAdminOrSuperadmin } from "@/middlewares/authorizeAdminOrSuperadmin";

const router = express.Router();

// Public endpoint
router.get("/", getProductsController);

// Protected endpoint - any authenticated user
router.get("/:id", authenticateFirebase, getProductController);

// Admin only
router.post("/", authenticateFirebase, authorizeAdminOrSuperadmin, createProductController);
router.put("/:id", authenticateFirebase, authorizeAdminOrSuperadmin, updateProductController);
router.delete("/:id", authenticateFirebase, authorizeAdminOrSuperadmin, deleteProductController);

export default router;

// ============================================================================
/**
 * EXAMPLE 8: Conditional Rendering based on Subscription Plan
 */

import { useAuth } from "@/context/AuthContext";

export function PremiumFeature() {
  const { user } = useAuth();

  const isPaid = user?.plan === "active" || user?.plan === "basic";
  const isSuspended = user?.plan === "suspended";

  if (isSuspended) {
    return (
      <div style={{ padding: "20px", background: "#fee", border: "1px solid #f00" }}>
        <h3>Subscription Suspended</h3>
        <p>Please update your payment to continue using this feature.</p>
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div style={{ padding: "20px", background: "#ffe", border: "1px solid #f0f" }}>
        <h3>Upgrade Required</h3>
        <p>This feature requires an active subscription.</p>
        <button>Upgrade Now</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Premium Feature</h3>
      <p>This is exclusive content for paid members.</p>
    </div>
  );
}

// ============================================================================
/**
 * EXAMPLE 9: Custom Hook for API Calls with Auth
 */

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/config/api";

export function useApiFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetch = useCallback(async () => {
    if (!isAuthenticated) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<{ data: T }>(url);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [url, isAuthenticated]);

  return { data, loading, error, fetch };
}

// Usage:
export function UsersList() {
  const { data: users, loading, fetch } = useApiFetch("/users");

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) return <div>Loading...</div>;
  if (!users) return <div>No users found</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>{user.email}</li>
      ))}
    </ul>
  );
}

// ============================================================================
/**
 * EXAMPLE 10: Protected Modal/Dialog
 */

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function SettingsModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Can only open settings if own profile or admin
  const canOpenSettings = 
    user?.role === "superadmin" || 
    user?.role === "admin";

  if (!canOpenSettings) {
    return null;
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Settings</button>
      
      {isOpen && (
        <div className="modal">
          <h2>Settings</h2>
          {user?.role === "superadmin" && <AdminSettings />}
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}

// ============================================================================
/**
 * SUMMARY OF PATTERNS
 */

/*
1. USE HOOKS FOR STATE
   - useAuth() - acceder usuario, métodos, estado de carga
   - useHasRole(), useHasAnyRole() - verificar roles
   - useNavigate() - redireccionar después de login

2. USE GUARDS PARA RUTAS
   - <AuthGuard> - requiere autenticado
   - <AdminGuard> - requiere admin+
   - <SuperAdminGuard> - requiere superadmin
   - <RoleGuard requiredRoles={[...]}>

3. USE AXIOS INTERCEPTOR AUTOMÁTICO
   - apiClient.get(), .post(), .patch(), .delete()
   - Token se añade automáticamente
   - Errores 401/403 se manejan automáticamente

4. USE CONDITIONAL RENDERING
   - if (!isAuthenticated) return <Login />
   - if (user?.role !== "admin") return <AccessDenied />
   - Mostrar/ocultar features basado en role/plan

5. HANDLE ERRORS GRACEFULLY
   - Try/catch en API calls
   - Mostrar mensajes de error al usuario
   - Redirigir a login si token inválido
*/
