import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(import.meta.env.VITE_LOGIN_EMAIL ?? "");
  const [password, setPassword] = useState(import.meta.env.VITE_LOGIN_PASSWORD ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      console.error("Login error", err);
      const message = err?.message || "Credenciales incorrectas";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ textAlign: "center" }}>
          <div className="subtitle">Bienvenido de vuelta</div>
          <h1 className="page-title" style={{ marginTop: 12 }}>
            Iniciar sesión
          </h1>
          <p className="text-muted" style={{ marginTop: 8 }}>
            Accede con tu correo y contraseña para continuar.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ marginTop: 18 }}>
          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
            />
          </label>

          <label htmlFor="password" style={{ marginTop: 14 }}>
            Contraseña
            <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingRight: 92 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="btn-secondary"
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  maxWidth: "none",
                  width: "auto",
                  padding: "8px 12px",
                  borderRadius: 12,
                  background: "#1f2937",
                  boxShadow: "none",
                }}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div style={{ marginTop: 10, textAlign: "right" }}>
              <Link
                to="/forgot-password"
                className="text-primary"
                style={{ fontWeight: 700 }}
              >
                ¿Olvidaste?
              </Link>
            </div>
          </label>

          {errorMsg && (
            <div
              className="badge badge-danger"
              style={{
                width: "100%",
                maxWidth: 420,
                marginTop: 14,
                borderRadius: 16,
                padding: "10px 12px",
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit"
            style={{ marginTop: 18, maxWidth: 420 }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div
            style={{
              width: "100%",
              maxWidth: 420,
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
              color: "var(--muted)",
            }}
          >
            <span
              style={{
                height: 1,
                background: "rgba(255,255,255,0.14)",
                flex: 1,
              }}
            />
            <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 4 }}>
              o continuar con
            </span>
            <span
              style={{
                height: 1,
                background: "rgba(255,255,255,0.14)",
                flex: 1,
              }}
            />
          </div>

          <div
            style={{
              width: "100%",
              maxWidth: 420,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 16,
            }}
          >
            <button
              type="button"
              className="btn"
              style={{ maxWidth: 999, width: "100%" }}
            >
              Google
            </button>
            <button
              type="button"
              className="btn"
              style={{ maxWidth: 999, width: "100%" }}
            >
              GitHub
            </button>
          </div>

          <p style={{ marginTop: 18, textAlign: "center" }}>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary" style={{ fontWeight: 900 }}>
              Regístrate ahora
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

