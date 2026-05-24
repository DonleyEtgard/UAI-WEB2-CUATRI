// ============================================================================
// LOGIN PAGE - Professional Authentication UI
// ============================================================================

import React, { useState,useEffect,} from "react";

import { useNavigate, useLocation,} from "react-router-dom";

import { useAuth } from "@/context/AuthContext"; // Usa alias si lo tienes, o asegura la ruta única

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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl ring-1 ring-white/10">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mb-6 shadow-lg shadow-blue-500/20">
              <span className="text-3xl">🏪</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Access your professional ERP Dashboard
            </p>
          </div>

          <div className="space-y-6">
            {/* ERROR ALERT */}
            {(formError || error) && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3 text-red-400">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-medium">{formError || error}</p>
                </div>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-300 mb-2 ml-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
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
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none mt-4"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700/50"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                Demo Access
              </span>
              <div className="flex-grow border-t border-slate-700/50"></div>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60 text-slate-300 font-semibold transition-all disabled:opacity-50"
            >
              Try Demo Account
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4"
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;