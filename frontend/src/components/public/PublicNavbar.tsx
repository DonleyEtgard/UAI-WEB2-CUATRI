import { Link } from "react-router-dom";
import InstallPWAButton from "../InstallPWAButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";


const PublicNavbar = () => {
  const { t } = useTranslation();
  return (
    <header className="public-navbar flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-black/70 to-black/40 backdrop-blur-md">
      <div className="flex items-center gap-3">
       <div className="flex items-center gap-4">
           {/* LOGO */}
           <div className="haitibiz-logo">
          <span className="haitibiz-logo-icon">🌐</span>
            </div>

           {/* TEXT */}
          <div className="flex flex-col">
          <h1 className="haitibiz-title">
            HAITI<span>BIZ</span>
          </h1>

         <p className="haitibiz-subtitle">
         ERP • POS • SaaS Platform
        </p>
        </div>
       </div>
      </div>

      
     <nav className="flex items-center gap-6 text-on-surface-variant">
       <Link to="/" className="hover:text-white transition">
        {t("navigation.publicNavbar.home")}
       </Link>

      <Link to="/about" className="hover:text-white transition">
        {t("navigation.publicNavbar.about")}
      </Link>

       <Link to="/contact" className="hover:text-white transition">
        {t("navigation.publicNavbar.contact")}
       </Link>

       <Link to="/login" className="hover:text-emerald-300 transition">
         {t("navigation.publicNavbar.login")}
        </Link>

        <div className="hover:text-white transition">
         <InstallPWAButton />
       </div>

      <div className="flex items-center gap-4">
        <LanguageSelector />

        <Link to="/login">
      </Link>
   </div>
     </nav>

        <div className="text-on-surface-variant">
         <div className="hidden lg:flex items-center gap-2 bg-surface-container/60 
         border border-outline-variant/60 rounded-full px-3 py-1 navbar-status">
         <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {t("navigation.publicNavbar.status")}
        </div>
        
      <Link to="/register" className="hover:text-white transition">
        🚀 {t("navigation.publicNavbar.access")}
      </Link>
      </div>
    </header>
  );
};

export default PublicNavbar;
