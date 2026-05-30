import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/AuthContext";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  if (!user && location.pathname.startsWith("/app")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    const path = location.pathname;

    if (path.includes("/users/roles")) return "Gestión de Roles";
    if (path.includes("/users")) return "Administración de Usuarios";
    if (path.includes("/products")) return "Gestión de Productos";
    if (path.includes("/sales")) return "Panel de Ventas";
    if (path.includes("/customers")) return "Directorio de Clientes";
    if (path.includes("/stock")) return "Control de Inventario";
    if (path.includes("/reports")) return "Reportes y Estadísticas";
    if (path.includes("/subscription")) return "Gestión de Suscripción";
    if (path.endsWith("/dashboard") || path === "/app")
      return "Dashboard";

    return "HAITIBIZ ERP";
  }, [location.pathname]);

return (
  <div className="flex h-screen w-full bg-[#131315] text-white overflow-hidden">

    {/* SIDEBAR (Empuja el contenido en desktop [Mini/Full] y es drawer en mobile) */}
    <Sidebar
      isOpen={open}
      onClose={() => setOpen(false)}
      onLogout={handleLogout}
    />

    {/* MAIN CONTENT AREA */}
    <div className="flex flex-col flex-1 min-w-0 h-full">

      <Navbar
        title={pageTitle}
        Name={user?.name || user?.email || "Usuario"}
        onToggleSidebar={() => setOpen(prev => !prev)}
      />

      <main
        className="
          flex-1
          overflow-y-auto
          p-4 md:p-6
          min-w-0
          bg-background
        "
      >
        <Outlet />
      </main>

    </div>
  </div>
);
};
export default DashboardLayout;