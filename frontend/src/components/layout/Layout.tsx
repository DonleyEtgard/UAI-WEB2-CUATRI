import { useState, useEffect } from "react";
import {
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import { useAuth } from "../../features/auth/AuthContext";

const Layout = () => {
  const [open, setOpen] = useState(false);

  const { isAuthenticated, loading } = useAuth();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // ⏳ esperar auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <span className="animate-pulse text-sm">
          Inicializando...
        </span>
      </div>
    );
  }

  // 🔐 redirect seguro
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar onToggleSidebar={() => setOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;