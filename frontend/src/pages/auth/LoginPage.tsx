// ============================================================================
// LOGIN PAGE - Professional Authentication UI
// ============================================================================

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

// ============================================================================
// COMPONENT
// ============================================================================

export const LoginPage: React.FC = () => {
  // ========================================================================
  // HOOKS
  // ========================================================================

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, user } = useAuth();

  const isAuthenticated = !!user;
  const isLoading = loading;
  const error = null;
  const clearError = () => {};

  // ========================================================================
  // STATE
  // ========================================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Redirect to dashboard if already authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  /**
   * Clear error when user types
   */
  useEffect(() => {
    if (formError || error) {
      const timer = setTimeout(() => {
        setFormError(null);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formError, error, clearError]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setFormError("Please enter your email");
      return;
    }

    if (!password) {
      setFormError("Please enter your password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      setFormError(null);
      await login(email, password);
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      setFormError(errorMessage);
    }
  };

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login("admin@example.com", "Password123!");
    } catch (err: any) {
      setFormError(err.message || "Demo login failed");
    }
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ERP System</h1>
          <p className="text-slate-400">Professional Authentication</p>
        </div>

        {/* CARD */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-8 shadow-2xl">
          {/* ERROR ALERT */}
          {(formError || error) && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm">
                <span className="font-semibold">Error:</span> {formError || error}
              </p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL INPUT */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-lg bg-slate-700/30 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-slate-400">Or try demo</span>
            </div>
          </div>

          {/* DEMO BUTTON */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:bg-slate-700 text-slate-200 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Demo Login
          </button>

          {/* FOOTER */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Demo Credentials:
            <br />
            <code className="text-blue-400">admin@example.com / Password123!</code>
          </p>
        </div>

        {/* FOOTER TEXT */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/auth/register")}
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

