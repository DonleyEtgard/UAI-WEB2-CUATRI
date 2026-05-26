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

  // Iniciamos en true para que en desktop el sidebar esté expandido por defecto
  const [open, setOpen] = useState(true);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  // Protección extra: Si por algún motivo AuthGuard deja pasar un null user
  if (!user && location.pathname.startsWith('/app')) {
    return null; // El AuthGuard se encargará de redirigir, aquí evitamos errores de renderizado
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/", { // Redirige a la HomePage después del logout
        replace: true,
      });

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // =========================================================
  // AUTO CLOSE MOBILE SIDEBAR
  // =========================================================

  useEffect(() => {
    // Solo cerramos automáticamente en pantallas móviles (< 768px)
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, [location.pathname]);

  // =========================================================
  // PAGE TITLE
  // =========================================================

  const pageTitle = useMemo(() => {

    const path = location.pathname;

    if (path.endsWith("/dashboard")) return "Dashboard";
    if (path.includes("/products")) return "Gestión de Productos";
    if (path.includes("/sales")) return "Panel de Ventas";
    if (path.includes("/customers")) return "Directorio de Clientes";
    if (path.includes("/stock")) return "Control de Inventario";
    if (path.includes("/users/roles")) return "Gestión de Roles";
    if (path.includes("/users")) return "Administración de Usuarios";
    if (path.includes("/reports")) return "Reportes y Estadísticas";

    return "HAITIBIZ ERP";

  }, [location.pathname]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className={`
        flex md:grid
        transition-[grid-template-columns] duration-300 ease-in-out
        ${open ? "md:grid-cols-[288px_1fr]" : "md:grid-cols-[0px_1fr]"}
        h-screen
        bg-background
        text-white
        overflow-hidden
      `}
    >

      {/* SIDEBAR */}
      <Sidebar
        isOpen={open}
        onClose={() => setOpen(false)}
        // En desktop, el grid lo posicionará. En móvil, sigue siendo fixed.
        onLogout={handleLogout} // Pasamos la función de logout al Sidebar
      />

      {/* CONTENT */}
      <div
        className="
          flex
          flex-col
          flex-1
          min-w-0
          overflow-hidden
          md:col-start-2 /* Asegura que este div comience en la segunda columna del grid */
        "
      >

        {/* NAVBAR */}
        <Navbar
          title={pageTitle}
          userName={user?.name || user?.email || "Usuario"}
          onToggleSidebar={() =>
            setOpen((prev) => !prev)
          }
        />

        {/* MAIN */}
        <main
          className="
            flex-1
            overflow-y-auto
            p-6
          "
        >
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;