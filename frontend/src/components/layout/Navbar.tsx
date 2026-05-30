import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchContext } from "../../context/GlobalSearchContext";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import type { SearchGroup } from "../../types/search";

type NavbarProps = {
  title?: string;
  onToggleSidebar?: () => void;
  Name?: string;
};

const Navbar: React.FC<NavbarProps> = ({
  title = "Dashboard",
  onToggleSidebar,
  Name = "Admin",
}) => {
  const navigate = useNavigate();
  const { query, setQuery, results, isOpen, setIsOpen } = useSearchContext();
  useGlobalSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar el buscador si se hace click fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <header
      className="
        sticky top-0 z-30
        flex items-center justify-between
        px-4 md:px-6 py-3
        border-b border-outline-variant/60
        bg-surface-container/55
        backdrop-blur-md
      "
    >
      {/* ================================================================== */}
      {/* LEFT */}
      {/* ================================================================== */}

      <div className="flex items-center gap-3 min-w-0">

        {/* SIDEBAR BUTTON */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="
              inline-flex items-center justify-center
              w-10 h-10 rounded-xl
              text-on-surface-variant
              hover:text-on-surface
              hover:bg-surface-container
              border border-outline-variant/60
            "
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        )}

        {/* LOGO + TITLE */}
        <div className="min-w-0">

          {/* TOP ROW */}
          <div className="flex items-center gap-3">

            {/* HOME LINK */}
            <Link
              to="/"
              className="
                inline-flex items-center justify-center
                w-10 h-10 rounded-xl
                bg-gradient-to-br
                from-primary/25 to-secondary/20
                border border-outline-variant/60
                hover:scale-105 transition
              "
              title="Ir al sitio principal"
            >
              🏠
            </Link>

            {/* DASHBOARD LINK */}
            <Link
              to="/app/dashboard"
              className="
                inline-flex items-center gap-2
                hover:opacity-80 transition
              "
            >
              <span
                className="
                  inline-flex items-center justify-center
                  w-9 h-9 rounded-xl
                  bg-gradient-to-br
                  from-primary/25 to-secondary/20
                  border border-outline-variant/60
                "
              >
              </span>

              <div>
                <h1 className="font-semibold text-on-surface truncate">
                  {title}
                </h1>
              </div>
            </Link>
          </div>

          {/* STATUS */}
          <div className="hidden md:flex items-center gap-2 mt-2">
            <span
              className="
                inline-flex items-center gap-1
                text-[11px]
                px-2.5 py-1 rounded-full
                bg-emerald-500/10
                text-emerald-300
                border border-emerald-500/20
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online (Sync)
            </span>

            <span
              className="
                inline-flex items-center gap-1
                text-[11px]
                px-2.5 py-1 rounded-full
                bg-indigo-500/10
                text-indigo-300
                border border-indigo-500/20
              "
            >
              ⭐ Plan: Pro
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT */}
      {/* ================================================================== */}

      <div className="flex items-center gap-3 md:gap-4" ref={searchRef}>

        {/* SEARCH */}
        <div className="hidden lg:block relative">
          <span className="text-on-surface-variant text-sm absolute left-3 top-1/2 -translate-y-1/2">
            🔎
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Buscar ventas, productos…"
            className="
              h-10 w-[260px]
              rounded-xl
              bg-surface-container
              border border-outline-variant/60
              pl-9 pr-3
              text-sm text-on-surface
              outline-none
              focus:border-primary/60
              transition-all
            "
          />

          {/* DROPDOWN DE RESULTADOS */}
          {isOpen && results.length > 0 && (
            <div className="
              absolute top-full mt-2 w-[350px] max-h-[400px] 
              bg-gray-950 border border-white/10 rounded-2xl 
              shadow-2xl overflow-y-auto z-50 p-2
              animate-in fade-in slide-in-from-top-2 duration-200
            ">
              {results.map((group: SearchGroup) => (
                <div key={group.category} className="mb-2">
                  <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted font-bold">
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery('');
                        navigate(item.url);
                      }}
                      className="
                        w-full flex items-center justify-between
                        px-3 py-2 rounded-xl
                        hover:bg-white/5 transition-colors
                        group text-left
                      "
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-on-surface-variant truncate">
                          {item.subtitle}
                        </div>
                      </div>
                      {item.badge && (
                        <span className="shrink-0 text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <button
          className="
            relative inline-flex items-center justify-center
            w-10 h-10 rounded-xl
            text-on-surface-variant
            hover:text-on-surface
            hover:bg-surface-container
            border border-outline-variant/60
          "
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          🔔

          <span
            className="
              absolute -top-1 -right-1
              bg-red-500 text-white text-xs
              px-1 rounded-full
            "
          >
            3
          </span>
        </button>

        {/* USER */}
        <div className="flex items-center gap-2">

          <div className="hidden sm:block">
            <div className="text-xs text-on-surface-variant">
              Bienvenido
            </div>

            <div className="text-sm font-medium text-on-surface">
              {Name}
            </div>
          </div>

          <div
            className="
              w-10 h-10
              bg-gradient-to-br
              from-primary to-secondary
              text-white
              rounded-2xl
              flex items-center justify-center
              border border-outline-variant/60
            "
          >
            {Name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
