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


 const linkClass = ({ isActive }: { isActive: boolean }) => `
  group flex items-center
  ${isOpen ? "gap-3 px-3" : "md:justify-center md:px-0"}
  py-2.5 rounded-xl transition-all duration-200 border
  ${
    isActive
      ? "bg-[#6366f1]/10 border-[#6366f1]/30 text-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.05)]"
      : "bg-transparent border-transparent text-[#9ca3af] hover:text-white hover:bg-white/5"
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
    fixed top-0 left-0 bottom-0 z-50
    h-full
    bg-[#131315]
    text-white
    border-r border-[#2b2d31]
    overflow-hidden
    transition-all duration-300 ease-in-out

    w-72 ${isOpen ? "translate-x-0" : "-translate-x-full"}

    md:relative
    md:translate-x-0
    ${isOpen ? "md:w-72" : "md:w-20"}
  `}
>
        {/* Contenedor interno que ajusta su ancho para el centrado de iconos */}
        <div className={`h-full flex flex-col px-3 py-4 overflow-y-auto transition-all duration-300 ${isOpen ? "w-72" : "w-full"}`}>
          
        {/* HEADER */}
        <div className={`flex items-center mb-6 px-2 ${isOpen ? "gap-3" : "justify-center"}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] flex items-center 
         justify-center shadow-lg shadow-[#6366f1]/30 shrink-0 border border-white/10">
            <span className="text-xl">⚡</span>
          </div>
          {isOpen && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2">
              <span className="font-bold tracking-tight text-white">HAITIBIZ ERP</span>
              <span className="text-[10px] text-[#9ca3af] uppercase tracking-widest font-bold">Dashboard </span>
            </div>
          )}
        </div>

        <div className="mx-3 h-px bg-[#2b2d31] mb-5" />

        {/* SECTION LABEL */}
        {isOpen && (
          <div className="px-4 mb-2">
            <span className="text-[10px] font-bold text-[#9ca3af]/40 uppercase tracking-[0.2em]">
              Menú Principal
            </span>
          </div>
        )}

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
            {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Dashboard</span>}
          </NavLink>

          {/* SALES */}
          <NavLink
            to="/app/sales"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">🧾</span>
            {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Ventas</span>}
          </NavLink>

          {/* PRODUCTS */}
          <NavLink
            to="/app/products"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">📦</span>
            {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Productos</span>}
          </NavLink>

          {/* CUSTOMERS */}
          <NavLink
            to="/app/customers"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">👥</span>
            {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Clientes</span>}
          </NavLink>

          {/* STOCK */}
          <NavLink
            to="/app/stock"
            className={linkClass}
            onClick={onClose}
          >
            <span className="text-xl shrink-0">📊</span>
            {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Inventario</span>}
          </NavLink>


          {/* ============================================================ */}
          {/* ADMIN / SUPERADMIN / MANAGER */}
          {/* ============================================================ */}

          {(user?.role === "admin" || user?.role === "superadmin" ) && (
            <>
              {isOpen && (
                <div className="px-4 mt-6 mb-2">
                  <span className="text-[10px] font-bold text-[#9ca3af]/40 uppercase tracking-[0.2em]">
                    Sistema
                  </span>
                </div>
              )}

              {/* USERS */}
              <NavLink
                to="/app/users"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">👤</span>
                {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Usuarios</span>}
              </NavLink>

              {/* ROLES */}
              <NavLink
                to="/app/users/roles"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">🔐</span>
                {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Roles</span>}
              </NavLink>

             
              {/* AUDIT LOG */}
              <NavLink
                to="/app/audit-log"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">📋</span>
                {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Actividad</span>}
              </NavLink>

              {/* REPORTS */}
              <NavLink
                to="/app/reports/sales"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">📈</span>
                {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Reportes</span>}
              </NavLink>

              {/* SUBSCRIPTION */}
              <NavLink
                to="/app/subscription"
                className={linkClass}
                onClick={onClose}
              >
                <span className="text-xl shrink-0">💳</span>
                {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Suscripción</span>}
              </NavLink>
            </>
          )}

          {/* ============================================================ */}
          {/* DIVIDER */}
          {/* ============================================================ */}

          <div className="mx-3 h-px bg-[#2b2d31] my-5" />

          {/* ============================================================ */}
          {/* PLAN CARD */}
          {/* ============================================================ */}

          {isOpen ? (
            <div
              className="
               rounded-xl
               border border-[#2b2d31]
               bg-[#1c1c21]
               p-4
                animate-in zoom-in duration-300
                relative overflow-hidden
              "
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#6366f1]/10 blur-2xl -mr-8 -mt-8" />
              <div className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider relative z-10">
                Plan sugerido
              </div>

              <div className="flex items-center justify-between mt-2 relative z-10">
                <div>
                  <div className="font-black text-sm text-white">
                    Pro
                  </div>
                  <div className="text-[10px] text-[#9ca3af] font-medium">
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
            className={`
              group flex items-center mt-auto mb-2 rounded-xl transition-all duration-200 
              border border-transparent text-[#9ca3af] hover:text-[#ef4444] 
              hover:bg-[#ef4444]/5 hover:border-[#ef4444]/10 w-full 
              ${isOpen ? "gap-3 px-3 py-2.5 text-left" : "md:justify-center md:px-0 md:py-2.5"}
            `}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              🚪
            </span>
            {isOpen && <span className="font-black text-sm text-white whitespace-nowrap animate-in fade-in duration-300">Cerrar Sesión</span>}
          </button>
        </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;