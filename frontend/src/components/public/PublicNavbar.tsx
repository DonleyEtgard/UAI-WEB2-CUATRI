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
          <h1 className="haitibiz-title text-sm sm:text-lg md:text-xl">
            HAITI<span>BIZ</span>
          </h1>

         <p className="haitibiz-subtitle text-[9px] sm:text-[10px] md:text-xs">
         ERP • SaaS • POS
        </p>
        </div>
       </div>
      </div>

    <nav
      className="
      flex
      flex-wrap
     items-center
      justify-center
      gap-1
      sm:gap-2
      md:gap-4
      lg:gap-6

     text-[11px]
     sm:text-xs
     md:text-sm

     text-on-surface-variant
    "
      >
       <Link to="/" className=" px-1 sm:px-2  py-1  whitespace-nowrap hover:text-white transition ">
        {t("navigation.publicNavbar.home")}
       </Link>

      <Link to="/about"  className=" px-1 sm:px-2 py-1 whitespace-nowrap hover:text-white transition">
        {t("navigation.publicNavbar.about")}
      </Link>

       <Link to="/contact"  className=" px-1 sm:px-2 py-1 whitespace-nowrap hover:text-white transition ">
        {t("navigation.publicNavbar.contact")}
       </Link>

       <Link to="/login"  className=" px-1 sm:px-2 py-1 whitespace-nowrap hover:text-white transition">
         {t("navigation.publicNavbar.login")}
        </Link>

        <div  className=" text-[11px] sm:text-xs md:text-sm hover:text-white transition ">
         <InstallPWAButton />
       </div>

      <div className="
        flex items-center gap-1 sm:gap-2 text-[11px]  sm:text-xs md:text-sm ">
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
        
      <Link to="/register"  className=" text-[11px] sm:text-xs
        md:text-sm whitespace-nowrap hover:text-white transition
        "
      >
        🚀 {t("navigation.publicNavbar.access")}
      </Link>
      </div>
    </header>
  );
};

export default PublicNavbar;
