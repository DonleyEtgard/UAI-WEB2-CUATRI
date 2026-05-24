import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role;

  /**
   * Logout handler
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <h1 className="text-xl font-bold mb-6">HAITIBIZ ERP</h1>

        <nav className="flex flex-col gap-3 text-sm">

          {/* TODOS */}
          <Link to="/app/dashboard">📊 Dashboard</Link>
          <Link to="/app/sales">💰 Ventas</Link>
          <Link to="/app/products">📦 Productos</Link>

          {/* SOLO ADMIN */}
          {(role === "admin" || role === "superadmin") && (
            <Link to="/app/users">👤 Usuarios</Link>
          )}

          {/* SOLO SUPERADMIN */}
          {role === "superadmin" && (
            <Link to="/app/settings">⚙️ Configuración</Link>
          )}

          {/* REPORTES (ADMIN + SUPERADMIN) */}
          {(role === "admin" || role === "superadmin") && (
            <Link to="/app/reports/sales">📈 Reportes</Link>
          )}

          <button
            onClick={handleLogout}
            className="text-left text-red-400 mt-6 hover:text-red-300 transition"
          >
            🚪 Salir
          </button>

        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <div>👋 {user?.email}</div>
          <div className="text-xs bg-gray-800 px-3 py-1 rounded">
            {role}
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;