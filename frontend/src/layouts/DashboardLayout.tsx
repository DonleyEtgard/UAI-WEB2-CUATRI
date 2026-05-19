import { Outlet, Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const DashboardLayout = () => {
  const user = useAppSelector((state) => state.auth.user);

  const role = user?.role;

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-4">
        <h1 className="text-xl font-bold mb-6">HAITIBIZ ERP</h1>

        <nav className="flex flex-col gap-3 text-sm">

          {/* TODOS */}
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/sales">💰 Ventas</Link>
          <Link to="/products">📦 Productos</Link>

          {/* SOLO ADMIN */}
          {(role === "admin" || role === "superadmin") && (
            <Link to="/users">👤 Usuarios</Link>
          )}

          {/* SOLO SUPERADMIN */}
          {role === "superadmin" && (
            <Link to="/settings">⚙️ Configuración</Link>
          )}

          {/* REPORTES (ADMIN + SUPERADMIN) */}
          {(role === "admin" || role === "superadmin") && (
            <Link to="/reports/sales">📈 Reportes</Link>
          )}

          <Link to="/" className="text-red-400 mt-6">
            🚪 Salir
          </Link>

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