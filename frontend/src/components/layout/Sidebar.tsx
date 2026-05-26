import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { user } = useAuth();


  const linkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `
    group flex items-center gap-3
    px-3 py-2 rounded-xl transition border
    ${
      isActive
        ? "bg-gradient-to-r from-primary/30 to-secondary/20 border-outline-variant/80 text-white"
        : "bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container/60 hover:border-outline-variant/60"
    }
  `;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          top-0 left-0 h-full
          bg-gray-950 text-white
          transition-all duration-300 ease-in-out
          border-r border-white/5
          overflow-y-auto overflow-x-hidden
          ${
            isOpen 
              ? "fixed md:static translate-x-0 z-50 w-72 p-5 opacity-100" 
              : "fixed md:static -translate-x-full z-50 w-0 p-0 border-none opacity-0 pointer-events-none"
          }
          /* En desktop, el grid controla la visibilidad. Aseguramos que no flote */
          md:translate-x-0 md:z-auto
        `}
      >
        {/* ================================================================ */}
        {/* HEADER */}
        {/* ================================================================ */}

        <div className="flex items-center gap-3 mb-6">
          <div
            className="
              w-11 h-11 rounded-2xl
              bg-gradient-to-br
              from-primary/35 to-secondary/25
              border border-outline-variant/80
              flex items-center justify-center
            "
          >
          </div>
        </div>

        <div className="h-px bg-outline-variant/60 mb-4" />

        {/* ================================================================ */}
        {/* NAVIGATION */}
        {/* ================================================================ */}

        <nav className="flex flex-col gap-1">

          {/* DASHBOARD */}
          <NavLink
            to="/app/dashboard"
            className={linkClass}
            end
            onClick={onClose}
          >
            <span className="text-lg">🏠</span>
            <span>Dashboard</span>
          </NavLink>

          {/* SALES */}
          <NavLink
            to="/app/sales"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-lg">🧾</span>
            <span>Ventas</span>
          </NavLink>

          {/* PRODUCTS */}
          <NavLink
            to="/app/products"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-lg">📦</span>
            <span>Productos</span>
          </NavLink>

          {/* CUSTOMERS */}
          <NavLink
            to="/app/customers"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-lg">👥</span>
            <span>Clientes</span>
          </NavLink>

          {/* STOCK */}
          <NavLink
            to="/app/stock"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-lg">📊</span>
            <span>Inventario</span>
          </NavLink>

          {/* ============================================================ */}
          {/* ADMIN / SUPERADMIN */}
          {/* ============================================================ */}

          {(user?.role === "admin" ||
            user?.role === "superadmin") && (
            <>
              {/* USERS */}
              <NavLink
                to="/app/users"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-lg">👤</span>
                <span>Usuarios</span>
              </NavLink>

              {/* ROLES */}
              <NavLink
                to="/app/users/roles"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-lg">🔐</span>
                <span>Roles</span>
              </NavLink>

              {/* REPORTS */}
              <NavLink
                to="/app/reports/sales"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-lg">📈</span>
                <span>Reportes</span>
              </NavLink>
            </>
          )}

          {/* ============================================================ */}
          {/* DIVIDER */}
          {/* ============================================================ */}

          <div className="h-px bg-outline-variant/60 my-4" />

          {/* ============================================================ */}
          {/* PLAN CARD */}
          {/* ============================================================ */}

          <div
            className="
              rounded-2xl
              border border-outline-variant/60
              bg-gradient-to-br
              from-primary/10 to-secondary/10
              p-3
            "
          >
            <div className="text-xs text-on-surface-variant">
              Plan sugerido
            </div>

            <div className="flex items-center justify-between mt-1">
              <div>
                <div className="font-semibold">
                  Pro
                </div>

                <div className="text-[11px] text-on-surface-variant">
                  + Analíticas
                </div>
              </div>

              <div className="text-2xl">
                🚀
              </div>
            </div>
          </div>
            {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="group flex items-center gap-3 px-3 py-2 mt-2 rounded-xl transition border border-transparent text-red-400 hover:bg-red-500/10 hover:border-red-500/20 w-full text-left"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              🚪
            </span>
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;