/**
 * EXAMPLE: How to use role-based access control in components
 * 
 * This demonstrates how to:
 * 1. Check permissions using usePermission hook
 * 2. Conditionally show/hide buttons and forms
 * 3. Disable features based on user role
 */

// ============================================
// EXAMPLE 1: Check permissions in a list page
// ============================================
import { usePermission } from "../hooks/usePermission";

export const ProductsListExample = () => {
  const { canCreate, canUpdate, canDelete } = usePermission("products");

  return (
    <div>
      <h1>Productos</h1>

      {/* Only show "Add Product" button if user can create */}
      {canCreate && (
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          + Nuevo Producto
        </button>
      )}

      {/* Product list */}
      <table>
        <tbody>
          <tr>
            <td>Producto 1</td>
            <td>
              {/* Show Edit button only if user can update */}
              {canUpdate && <button>Editar</button>}

              {/* Show Delete button only if user can delete */}
              {canDelete && <button>Eliminar</button>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// EXAMPLE 2: Check multiple permissions
// ============================================
export const DashboardExample = () => {
  const productsPerms = usePermission("products");
  const salesPerms = usePermission("sales");
  const usersPerms = usePermission("users");

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Show products card only if user can view products */}
      {productsPerms.canView && (
        <div className="p-4 border rounded">
          <h3>Productos</h3>
          <p>Total: 150</p>
          {productsPerms.canCreate && (
            <button>Agregar Producto</button>
          )}
        </div>
      )}

      {/* Show sales card only if user can view sales */}
      {salesPerms.canView && (
        <div className="p-4 border rounded">
          <h3>Ventas</h3>
          <p>Hoy: $5,000</p>
          {salesPerms.canCreate && (
            <button>Nueva Venta</button>
          )}
        </div>
      )}

      {/* Show users card only if user can view users */}
      {usersPerms.canView && (
        <div className="p-4 border rounded">
          <h3>Usuarios</h3>
          <p>Total: 25</p>
          {usersPerms.canCreate && (
            <button>Agregar Usuario</button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 3: Disable form fields based on role
// ============================================
export const ProductFormExample = () => {
  const { canCreate, canUpdate, canDelete } = usePermission("products");

  return (
    <form>
      <input type="text" placeholder="Nombre del producto" />
      <input type="number" placeholder="Precio" />

      <div className="flex gap-2">
        {canCreate && <button type="submit">Crear</button>}
        {canUpdate && <button type="button">Actualizar</button>}
        {canDelete && (
          <button
            type="button"
            className="bg-red-600 text-white"
            onClick={() => console.log("Delete product")}
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
};

// ============================================
// EXAMPLE 4: Check specific role
// ============================================
import { useIsRole } from "../hooks/usePermission";

export const SettingsExample = () => {
  const { isSuperAdmin, isAdmin } = useIsRole();

  return (
    <div className="p-4">
      <h2>Configuración del Sistema</h2>

      {/* Only superadmins can see all system settings */}
      {isSuperAdmin && (
        <div>
          <h3>⚙️ Configuración Avanzada</h3>
          <button>Administrar Organizaciones</button>
          <button>Ver Logs del Sistema</button>
          <button>Configurar Seguridad</button>
        </div>
      )}

      {/* Admins and superadmins can see organization settings */}
      {(isAdmin || isSuperAdmin) && (
        <div>
          <h3>🏢 Configuración de Organización</h3>
          <button>Editar Nombre</button>
          <button>Ver Equipo</button>
          <button>Gestionar Planes</button>
        </div>
      )}
    </div>
  );
};

// ============================================
// EXAMPLE 5: Dynamic menu based on permissions
// ============================================
import { useAccessibleModules } from "../hooks/usePermission";

export const NavigationExample = () => {
  const accessibleModules = useAccessibleModules();

  const menuItems = {
    dashboard: { label: "Dashboard", path: "/app" },
    products: { label: "Productos", path: "/app/products" },
    customers: { label: "Clientes", path: "/app/customers" },
    sales: { label: "Ventas", path: "/app/sales" },
    users: { label: "Usuarios", path: "/app/users" },
    stock: { label: "Stock", path: "/app/stock" },
    reports: { label: "Reportes", path: "/app/reports/sales" },
    settings: { label: "Configuración", path: "/app/settings" },
  };

  return (
    <nav className="flex gap-4">
      {accessibleModules.map((module) => (
        <a key={module} href={menuItems[module as keyof typeof menuItems].path}>
          {menuItems[module as keyof typeof menuItems].label}
        </a>
      ))}
    </nav>
  );
};
