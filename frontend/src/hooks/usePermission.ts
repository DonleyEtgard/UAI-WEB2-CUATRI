import { useAuth } from "../context/AuthContext";
import { hasPermission, canView, canCreate, canUpdate, canDelete, getAccessibleModules } from "../config/rbac";
import type { RolePermissions } from "../config/rbac";

/**
 * Hook to check permissions in components
 * Usage: const { canEdit, canDelete } = usePermission("products");
 */
export const usePermission = (module: keyof RolePermissions) => {
  const { user } = useAuth();
  const role = user?.role ?? "employee";

  return {
    canView: canView(role, module),
    canCreate: canCreate(role, module),
    canUpdate: canUpdate(role, module),
    canDelete: canDelete(role, module),
    hasPermission: (action: keyof RolePermissions[typeof module]) =>
      hasPermission(role, module, action),
  };
};

/**
 * Hook to get all modules a user has access to
 */
export const useAccessibleModules = () => {
  const { user } = useAuth();
  const role = user?.role ?? "employee";
  return getAccessibleModules(role);
};

/**
 * Hook to check if user is a specific role
 */
export const useIsRole = () => {
  const { user } = useAuth();

  return {
    isSuperAdmin: user?.role === "superadmin",
    isAdmin: user?.role === "admin",
    isEmployee: user?.role === "employee",
    isAdminOrSuperAdmin: user?.role === "admin" || user?.role === "superadmin",
  };
};
