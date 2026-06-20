// ============================================================================
// LOGOUT EXAMPLE - How to implement logout functionality
// ============================================================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Example Logout Button Component
 */
export const LogoutButton: React.FC = () => {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

/**
 * Example Logout from User Menu/Profile
 */
export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* MENU BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {user.name[0]}
        </div>
        <span className="text-white">{user.name}</span>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50">
          {/* USER INFO */}
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm text-slate-200">{user.email}</p>
            <p className="text-xs text-slate-400 mt-1">Role: {user.role}</p>
          </div>

          {/* MENU ITEMS */}
          <button
            onClick={() => {
              navigate("/dashboard");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-700 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/profile");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-700 transition"
          >
            Profile
          </button>

          <button
            onClick={() => {
              navigate("/settings");
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-700 transition"
          >
            Settings
          </button>

          {/* LOGOUT */}
          <div className="border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
