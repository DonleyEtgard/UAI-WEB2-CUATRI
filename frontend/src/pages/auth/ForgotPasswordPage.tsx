import React, { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { forgotPassword, error, clearError, isLoading } = useAuth();

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => clearError?.();
  }, [clearError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Por favor ingresa tu correo electrónico.");
      return;
    }

    setLocalLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setIsEmailSent(true);
    } catch (err) {
      console.error("Error al solicitar recuperación:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = localLoading || isLoading;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs (Igual que en Login/Register) */}
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
            <p className="haitibiz-subtitle">Recuperación de Cuenta</p>
          </div>

          {/* ERROR ALERT */}
          {(localError || error) && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <p className="text-sm font-medium text-red-400">{localError || error}</p>
            </div>
          )}

          {isEmailSent ? (
            <div className="space-y-6 text-center">
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="text-3xl">📧</div>
                <p className="text-emerald-300 font-bold">¡Instrucciones enviadas!</p>
                <p className="text-xs text-emerald-300/70">
                  Revisa tu bandeja de entrada. Te hemos enviado un enlace para que puedas restablecer tu contraseña de forma segura.
                </p>
              </div>
              
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold transition-all hover:scale-[1.02]"
              >
                Volver al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-1">¿Olvidaste tu contraseña?</h2>
                <p className="text-sm text-slate-400">Ingresa tu email y te ayudaremos a volver.</p>
              </div>

              <label htmlFor="email">
                Email Address
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@haitibiz.com"
                  disabled={loading}
                />
              </label>

              <button type="submit" disabled={loading} className="mt-4">
                {loading ? "Procesando..." : "Enviar Instrucciones"}
              </button>

              <p className="text-center text-slate-400 text-sm font-medium">
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4">
                  Volver al inicio de sesión
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;