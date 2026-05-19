import { Link, useLocation } from "react-router-dom";
import { 
  Dashboard, 
  ShoppingCart, 
  People, 
  Inventory, 
  BarChart, 
  Settings,
  Close
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { title: "Dashboard", icon: <Dashboard />, path: "/app" },
  { title: "Ventas", icon: <ShoppingCart />, path: "/app/sales" },
  { title: "Clientes", icon: <People />, path: "/app/customers" },
  { title: "Inventario", icon: <Inventory />, path: "/app/inventory" },
  { title: "Reportes", icon: <BarChart />, path: "/app/reports" },
  { title: "Ajustes", icon: <Settings />, path: "/app/settings" },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-container border-r border-outline-variant transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* LOGO */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-xl">
              🏪
            </div>
            <span className="font-bold text-white tracking-widest text-lg">
              HAITIBIZ
            </span>
          </div>
          <IconButton 
            onClick={onClose} 
            className="md:hidden text-on-surface-variant"
            size="small"
          >
            <Close />
          </IconButton>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 space-y-2 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"
                }`}
              >
                <span className={isActive ? "text-inherit" : "text-primary"}>{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;