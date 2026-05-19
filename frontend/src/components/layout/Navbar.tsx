import React from "react";

type NavbarProps = {
  title?: string;
  onToggleSidebar?: () => void;
  userName?: string;
};

const Navbar: React.FC<NavbarProps> = ({
  title = "Dashboard",
  onToggleSidebar,
  userName = "Admin",
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between 
    px-4 md:px-6 py-3 border-b border-outline-variant/60 bg-surface-container/55 backdrop-blur-md">
      <div className="flex items-center gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl 
            text-on-surface-variant hover:text-on-surface hover:bg-surface-container border 
            border-outline-variant/60"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl 
            bg-gradient-to-br from-primary/25 to-secondary/20 border border-outline-variant/60">
              🧠
            </span>
            <h1 className="font-semibold text-on-surface truncate">
              {title}
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full
             bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online (Sync)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 
            rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              ⭐ Plan: Pro
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-on-surface-variant text-sm">🔎</span>
          <input
            placeholder="Buscar ventas, productos…"
            className="h-10 w-[260px] rounded-xl bg-surface-container border border-outline-variant/60 
            px-3 text-sm text-on-surface"
          />
        </div>

        <button
          className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl 
          text-on-surface-variant hover:text-on-surface hover:bg-surface-container border border-outline-variant/60"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          🔔
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">3</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <div className="text-xs text-on-surface-variant">Bienvenido</div>
            <div className="text-sm font-medium text-on-surface">{userName}</div>
          </div>

          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary text-white 
          rounded-2xl flex items-center justify-center border border-outline-variant/60">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
