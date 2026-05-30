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
    group flex items-center ${isOpen ? "gap-3 px-3" : "md:justify-center md:px-0"}
    py-2 rounded-xl transition-all duration-200 border
    ${
      isActive
        ? "bg-gradient-to-r from-primary/30 to-secondary/20 border-outline-variant/80 text-white"
        : "bg-transparent border-transparent text-on-surface-variant hover:bg-white/5"
    }
  `;

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        className={`
          fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      <aside
        className={`
          /* Posicionamiento Base (Mobile) */
          fixed top-0 left-0 bottom-0 z-50
          h-full
          bg-gray-950
          text-white
          border-r border-white/5
          overflow-x-hidden
          transition-all duration-300 ease-in-out
          
          /* Mobile behavior */
          w-72 ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          
          /* Desktop behavior: Mini vs Full */
          md:relative
          md:translate-x-0
          ${isOpen ? "md:w-72" : "md:w-20"}
        `}
      >
        {/* Contenedor interno que ajusta su ancho para el centrado de iconos */}
        <div className={`h-full flex flex-col p-4 overflow-y-auto transition-all duration-300 ${isOpen ? "w-72" : "w-full"}`}>
          
        {/* HEADER */}
        <div className={`flex items-center mb-6 px-2 ${isOpen ? "gap-3" : "justify-center"}`}>
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
            <span className="text-xl shrink-0">🏠</span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Dashboard</span>}
          </NavLink>

          {/* SALES */}
          <NavLink
            to="/app/sales"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">🧾</span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Ventas</span>}
          </NavLink>

          {/* PRODUCTS */}
          <NavLink
            to="/app/products"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">📦</span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Productos</span>}
          </NavLink>

          {/* CUSTOMERS */}
          <NavLink
            to="/app/customers"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">👥</span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Clientes</span>}
          </NavLink>

          {/* STOCK */}
          <NavLink
            to="/app/stock"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">📊</span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Inventario</span>}
          </NavLink>

          {/* STOCK CRÍTICO */}
          <NavLink
            to="/app/stock/critical"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">⚠️</span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Stock Crítico</span>}
          </NavLink>

          {/* ============================================================ */}
          {/* ADMIN / SUPERADMIN / MANAGER */}
          {/* ============================================================ */}

          {(user?.role === "admin" || user?.role === "superadmin" || user?.role === "manager") && (
            <>
              {/* USERS */}
              <NavLink
                to="/app/users"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">👤</span>
                {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Usuarios</span>}
              </NavLink>

              {/* ROLES */}
              <NavLink
                to="/app/users/roles"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">🔐</span>
                {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Roles</span>}
              </NavLink>

              {/* REPORTS */}
              <NavLink
                to="/app/reports/sales"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">📈</span>
                {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Reportes</span>}
              </NavLink>

              {/* SUBSCRIPTION */}
              <NavLink
                to="/app/subscription"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">💳</span>
                {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Suscripción</span>}
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

          {isOpen ? (
            <div
              className="
                rounded-2xl
                border border-outline-variant/60
                bg-gradient-to-br
                from-primary/10 to-secondary/10
                p-3
                animate-in zoom-in duration-300
              "
            >
              <div className="text-xs text-on-surface-variant">
                Plan sugerido
              </div>

              <div className="flex items-center justify-between mt-1">
                <div>
                  <div className="font-semibold text-sm">
                    Pro
                  </div>
                  <div className="text-[10px] text-on-surface-variant">
                    + Analíticas
                  </div>
                </div>
                <div className="text-xl">🚀</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center text-xl py-2 opacity-80" title="Plan Pro sugerido">
              🚀
            </div>
          )}

            {/* LOGOUT */}
          <button
            onClick={onLogout}
            className={`group flex items-center mt-2 rounded-xl transition-all duration-200 border border-transparent text-red-400 hover:bg-red-500/10 hover:border-red-500/20 w-full ${isOpen ? "gap-3 px-3 py-2 text-left" : "md:justify-center md:px-0 md:py-2"}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              🚪
            </span>
            {isOpen && <span className="font-medium whitespace-nowrap animate-in fade-in duration-300">Cerrar Sesión</span>}
          </button>
        </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;