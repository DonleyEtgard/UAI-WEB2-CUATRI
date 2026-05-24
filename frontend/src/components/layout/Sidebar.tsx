import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 px-3 py-2 rounded-xl transition border ${
      isActive
        ? "bg-gradient-to-r from-primary/30 to-secondary/20 border-outline-variant/80 text-white"
        : "bg-transparent border-transparent text-on-surface-variant hover:bg-surface-container/60 hover:border-outline-variant/60"
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full w-72
          bg-gray-950 text-white p-5
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/35 to-secondary/25 border border-outline-variant/80 flex items-center justify-center">
              🧩
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight">Nexus ERP</h2>
              <p className="text-[11px] text-on-surface-variant">ERP • POS • SaaS</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-outline-variant/60 mb-4" />

        <nav className="flex flex-col gap-1">
          <NavLink to="dashboard" className={linkClass} onClick={onClose}>
            <span className="text-lg">🏠</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="sales" className={linkClass} onClick={onClose}>
            <span className="text-lg">🧾</span>
            <span>Ventas</span>
          </NavLink>

          <NavLink to="products" className={linkClass} onClick={onClose}>
            <span className="text-lg">📦</span>
            <span>Productos</span>
          </NavLink>

          <NavLink to="clients" className={linkClass} onClick={onClose}>
            <span className="text-lg">👥</span>
            <span>Clientes</span>
          </NavLink>

          <NavLink to="stock" className={linkClass} onClick={onClose}>
            <span className="text-lg">📊</span>
            <span>Inventario</span>
          </NavLink>

          {(user?.role === "admin" || user?.role === "superadmin") && (
            <NavLink to="users" className={linkClass} onClick={onClose}>
              <span className="text-lg">👤</span>
              <span>Usuarios</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="mt-2 group flex items-center gap-3 px-3 py-2 rounded-xl transition bg-surface-container/60 border border-outline-variant/60 text-indigo-300"
              onClick={onClose}
            >
              <span className="text-lg">⚙️</span>
              <span>Admin</span>
            </NavLink>
          )}

          <div className="h-px bg-outline-variant/60 my-4" />

          <div className="rounded-2xl border border-outline-variant/60 bg-gradient-to-br from-primary/10 to-secondary/10 p-3">
            <div className="text-xs text-on-surface-variant">Plan sugerido</div>
            <div className="flex items-center justify-between mt-1">
              <div>
                <div className="font-semibold">Pro</div>
                <div className="text-[11px] text-on-surface-variant">+ Analíticas</div>
              </div>
              <div className="text-2xl">🚀</div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

