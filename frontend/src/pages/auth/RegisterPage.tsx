// Clean RegisterPage implementation
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, user } = useAuth();

  const isAuthenticated = !!user;
  const isLoading = loading;
  const error = null;
  const clearError = () => {};

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
    return () => clearError?.();
  }, [isAuthenticated, navigate, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }
    try {
      setFormError(null);
      await register(formData.email, formData.password, formData.name, formData.lastName);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setFormError(err?.message || error || "Error al registrarse");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card" style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center" }}>
          <div className="subtitle">Comencemos</div>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            Crear cuenta
          </h1>
          <p className="text-muted" style={{ marginTop: 8 }}>
            Regístrate con correo y contraseña para acceder al panel.
          </p>
        </div>

        {(formError || error) && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">
              <span className="font-semibold">Error:</span> {formError || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
          <label htmlFor="name">
            Nombre
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          </label>

          <label htmlFor="lastName" style={{ marginTop: 12 }}>
            Apellido
            <input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleChange} required />
          </label>

          <label htmlFor="email" style={{ marginTop: 12 }}>
            Email
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </label>

          <label htmlFor="password" style={{ marginTop: 12 }}>
            Contraseña
            <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
              <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword((s) => !s)} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }}>{showPassword ? "Ocultar" : "Mostrar"}</button>
            </div>
          </label>

          <label htmlFor="confirmPassword" style={{ marginTop: 12 }}>
            Confirmar contraseña
            <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required />
          </label>

          <button type="submit" disabled={isLoading} className="submit" style={{ marginTop: 18 }}>{isLoading ? "Creando cuenta..." : "Crear cuenta"}</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;