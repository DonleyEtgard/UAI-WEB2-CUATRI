// ============================================================================
// REGISTER PAGE - Professional ERP Onboarding
// ============================================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";


const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  useEffect(() => {
    return () => clearError?.();
  }, [clearError]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.email || !formData.password || !formData.name || !formData.lastName) {
      setFormError(t("register.fillRequiredFields"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError(t("register.passwordsDoNotMatch"));
      return;
    }
    try {
      setFormError(null);
      await register(
        formData.email.trim().toLowerCase(), 
        formData.password,
        formData.name.trim(), 
        formData.lastName.trim(),
        {
          street: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          postalCode: formData.zipCode.trim() || undefined
        }
      );
      navigate("/app/dashboard", { replace: true });
    } catch (err: any) {
      setFormError(err?.message || error || t("register.registrationError"));
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
      
      <div className="w-full z-10 animate-in fade-in zoom-in duration-500">
        <div className="form-container" style={{ maxWidth: '600px' }}>
          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <div className="haitibiz-logo mb-4">
              <span className="haitibiz-logo-icon">🏪</span>
            </div>
            <h1 className="haitibiz-title">
              HAITI<span>BIZ</span>
            </h1>
            <p className="haitibiz-subtitle">{t("register.createProfessionalAccount")}</p>
          </div>

          {/* ERROR ALERT */}
          {(formError || error) && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium text-red-400">{formError || error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-grid-2">
              <label htmlFor="name">
                {t("register.firstName")}
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label htmlFor="lastName">
                {t("register.lastName")}
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label htmlFor="email">
              {t("register.emailAddress")}
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>

            {/* ADDRESS SECTION */}
            <label htmlFor="address">
              {t("register.fullAddress")}
              <input
                id="address"
                name="address"
                type="text"
                placeholder={t("register.addressPlaceholder")}
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-grid-2">
              <label htmlFor="city">
                {t("register.city")}
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </label>
              <label htmlFor="zipCode">
                {t("register.zipCode")}
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="form-grid-2">
              <label htmlFor="password">
                <div className="flex justify-between items-center w-full">
                  <span>{t("auth.password")}</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
                    style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, margin: 0, color:'#06b6d4' }}
                  >
                    {showPassword ? t("auth.hide") : t("auth.show")}
                  </button>
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <label htmlFor="confirmPassword">
                <div className="flex justify-between items-center w-full">
                  <span>{t("register.confirmPassword")}</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
                    style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, margin: 0, color:'#06b6d4' }}
                  >
                    {showPassword ? t("auth.hide") : t("auth.show")}
                  </button>
                </div>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? t("register.provisioningWorkspace") : t("register.registerButton")}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm font-medium">
            {t("auth.dontHaveAccount")}{" "}
            <button 
              onClick={() => navigate("/login")} 
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4"
              style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, display: 'inline', transform: 'none' }}
            >
              {t("register.signIn")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;