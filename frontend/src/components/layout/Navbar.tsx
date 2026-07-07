import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "../../context/GlobalSearchContext";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { useAuth } from "../../context/AuthContext";
import type { SearchGroup } from "../../types/search";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

type NavbarProps = {
  title?: string;
  onToggleSidebar?: () => void;
  onLogout?: () => Promise<void>;
  Name?: string;
};

const Navbar: React.FC<NavbarProps> = ({
  title = "Dashboard",
  onToggleSidebar,
  onLogout,
  Name = "Admin",
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
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
    w-full
    min-h-[72px]
    flex items-center justify-between
    px-6 lg:px-8
    border-b border-zinc-800/50
    bg-zinc-950/80
    backdrop-blur-md
  "
>
      {/* LEFT AREA: Sidebar Toggle & Title */}
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-all"
            aria-label="Toggle sidebar"
          >
            <span className="text-xl">☰</span>
          </button>
        )}

        <div className="flex flex-col min-w-0">
          <h1 className="text-sm font-bold text-white truncate leading-none">
            {title}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sistema Online</span>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* RIGHT */}
      {/* ================================================================== */}

      <div className="flex items-center gap-3 md:gap-4" ref={searchRef}>

        {/* SEARCH */}
        <div className="hidden xl:block relative group">
          <span className="text-zinc-600 text-sm absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors">
            🔎
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Buscar en el sistema..."
            className="
              h-10 w-[240px] rounded-xl 
              bg-zinc-900/50 border border-zinc-800 
              pl-9 pr-3
              text-sm text-zinc-200
              outline-none
              focus:border-indigo-500/50
              transition-all
            "
          />

          {/* DROPDOWN DE RESULTADOS */}
          {isOpen && results.length > 0 && (
            <div className="
              absolute top-full mt-2 w-[350px] max-h-[400px] 
              bg-zinc-950 border border-zinc-800 rounded-2xl 
              shadow-2xl overflow-y-auto z-50 p-2
              animate-in fade-in slide-in-from-top-2 duration-200
            ">
              {results.map((group: SearchGroup) => (
                <div key={group.category} className="mb-2">
                  <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
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
                        hover:bg-indigo-500/10 transition-colors
                        group text-left
                      "
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-zinc-200 truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-zinc-500 truncate">
                          {item.subtitle}
                        </div>
                      </div>
                      {item.badge && (
                        <span className="shrink-0 text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 
                        text-red-400 border border-red-500/20">
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
         <div className="flex items-center gap-3">
          <LanguageSelector />
          {/* <UserMenu /> */}
          {/* <LogoutButton /> */}
        </div>

{/* UTILS & USER */}
<div
  className="flex items-center justify-end min-w-[320px]"
>
  {/* USUARIO */}
  <div className="relative group/user">
    <button
  className="
    flex items-center
    gap-3
    px-4 py-2
    rounded-2xl
    bg-zinc-900/40
    border border-zinc-800
    hover:border-indigo-500/40
    hover:bg-zinc-900/70
    transition-all
  "
>
      {/* Avatar a la izquierda */}
      <div
        className="
          w-11 h-11
          rounded-full
          bg-gradient-to-br
          from-indigo-500
          to-indigo-700
          flex items-center justify-center
          text-white
          font-bold
          text-lg
          shadow-lg
        "
      >
        {Name?.charAt(0).toUpperCase()}
        {/* UTILS & USER */}
       
      </div>

      {/* Nombre y rol */}
      <div className="flex flex-col items-start w-[220px]">
        <span className="text-sm font-bold text-white">
          {Name}
        </span>

      </div>
      </button>

    {/* Dropdown */}
    <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all p-1.5 z-50">
      <div className="px-4 py-3 border-b border-zinc-900 mb-1">
        <p className="text-xs text-zinc-500">
          Sesión iniciada como
        </p>

        <p className="text-sm font-bold text-white truncate">
          {user?.email}
        </p>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
      >
        🚪 {t("navigation.navbar.logout")}
      </button>
       </div>
      </div>
      </div>
          </div>
    </header>
  );
};

export default Navbar;