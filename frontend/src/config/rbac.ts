import type { UserRole } from "../types/firestore";

export interface Permission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface RolePermissions {
  dashboard: Permission;
  products: Permission;
  customers: Permission;
  sales: Permission;
  users: Permission;
  stock: Permission;
  reports: Permission;
  settings: Permission;
}

/**
 * Role-Based Access Control (RBAC)
 * Define what each role can do across the application
 */
export const rolePermissions: Record<UserRole, RolePermissions> = {
  superadmin: {
    dashboard: { view: true, create: true, update: true, delete: true },
    products: { view: true, create: true, update: true, delete: true },
    customers: { view: true, create: true, update: true, delete: true },
    sales: { view: true, create: true, update: true, delete: true },
    users: { view: true, create: true, update: true, delete: true },
    stock: { view: true, create: true, update: true, delete: true },
    reports: { view: true, create: true, update: true, delete: true },
    settings: { view: true, create: true, update: true, delete: true },
  },
  admin: {
    dashboard: { view: true, create: false, update: false, delete: false },
    products: { view: true, create: true, update: true, delete: true },
    customers: { view: true, create: true, update: true, delete: true },
    sales: { view: true, create: true, update: true, delete: true },
    users: { view: true, create: true, update: true, delete: false },
    stock: { view: true, create: true, update: true, delete: false },
    reports: { view: true, create: true, update: true, delete: false },
    settings: { view: true, create: false, update: false, delete: false },
  },
  employee: {
    dashboard: { view: true, create: false, update: false, delete: false },
    products: { view: true, create: false, update: false, delete: false },
    customers: { view: true, create: true, update: true, delete: false },
    sales: { view: true, create: true, update: false, delete: false },
    users: { view: false, create: false, update: false, delete: false },
    stock: { view: true, create: false, update: false, delete: false },
    reports: { view: true, create: false, update: false, delete: false },
    settings: { view: false, create: false, update: false, delete: false },
  },
};

/**
 * Check if a role has permission for a specific module and action
 */
export const hasPermission = (
  role: UserRole,
  module: keyof RolePermissions,
  action: keyof Permission
): boolean => {
  return rolePermissions[role]?.[module]?.[action] ?? false;
};

/**
 * Check if a role can view a module
 */
export const canView = (role: UserRole, module: keyof RolePermissions): boolean => {
  return hasPermission(role, module, "view");
};

/**
 * Check if a role can create in a module
 */
export const canCreate = (role: UserRole, module: keyof RolePermissions): boolean => {
  return hasPermission(role, module, "create");
};

/**
 * Check if a role can update in a module
 */
export const canUpdate = (role: UserRole, module: keyof RolePermissions): boolean => {
  return hasPermission(role, module, "update");
};

/**
 * Check if a role can delete in a module
 */
export const canDelete = (role: UserRole, module: keyof RolePermissions): boolean => {
  return hasPermission(role, module, "delete");
};

/**
 * Get all accessible modules for a role
 */
export const getAccessibleModules = (role: UserRole): (keyof RolePermissions)[] => {
  return Object.keys(rolePermissions[role]).filter(
    (module) => rolePermissions[role][module as keyof RolePermissions].view
  ) as (keyof RolePermissions)[];
};
