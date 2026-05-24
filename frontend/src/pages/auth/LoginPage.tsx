// ============================================================================
// LOGIN PAGE - Professional Authentication UI
// ============================================================================

import React, { useState,useEffect,} from "react";

import { useNavigate, useLocation,} from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

// ============================================================================
// COMPONENT
// ============================================================================

const LoginPage: React.FC = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { login, isLoading, error,clearError } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [formError, setFormError] =
    useState<string | null>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Auto clear errors
   */
  useEffect(() => {
    if (formError || error) {
      const timer = setTimeout(() => {
        setFormError(null);

        clearError();
      }, 5000);

      return () =>
        clearTimeout(timer);
    }
  }, [
    formError,
    error,
    clearError,
  ]);
  /**
   * Login submit
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // clear old errors
    setFormError(null);

    // validation
    if (!email.trim()) {
      setFormError(
        "Please enter your email"
      );

      return;
    }

    if (!password.trim()) {
      setFormError(
        "Please enter your password"
      );

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFormError(
        "Please enter a valid email address"
      );

      return;
    }

    try {
      await login(
        email.trim(),
        password
      );

      const from = (location.state as any)?.from?.pathname || "/app/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(
        "❌ Login error:",
        err
      );

      setFormError(
        err.message ||
          "Login failed. Please try again."
      );
    }
  };

  /**
   * Demo login
   */
  const handleDemoLogin =
    async () => {
      try {
        setFormError(null);

        await login(
          "admin@example.com",
          "Password123!"
        );
      } catch (err: any) {
        setFormError(
          err.message ||
            "Demo login failed"
        );
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
        <div className="form-container">
          {/* HEADER */}
          <div className="flex flex-col items-center mb-10">
            <div className="haitibiz-logo mb-4">
              <span className="haitibiz-logo-icon">🏪</span>
            </div>
            <h1 className="haitibiz-title">
              HAITI<span>BIZ</span>
            </h1>
            <p className="haitibiz-subtitle">Professional ERP Platform</p>
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
            <label htmlFor="email">
              Email Address
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                required
              />
            </label>

            <label htmlFor="password">
              <div className="flex justify-between items-center w-full">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300"
                  style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, margin: 0 }}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </label>

            <button type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-slate-700/50"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
              Quick Access
            </span>
            <div className="flex-grow border-t border-slate-700/50"></div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="btn-secondary"
          >
            Try Demo Account
          </button>
        </div>

        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4"
            style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, display: 'inline', transform: 'none' }}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;