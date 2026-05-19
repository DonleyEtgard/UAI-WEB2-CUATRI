import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../firebase/auth";
import { createOrUpdateUserProfile } from "../../firebase/firestore";
import type { AppUser } from "../../types/firestore";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    street: "",
    number: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const userCredential = await registerUser(form.email, form.password);
      const newUser: AppUser = {
        uid: userCredential.user.uid,
        email: form.email,
        displayName: form.name,
        role: "employee",
        organizationId: "",
        isActive: true,
        plan: "free",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await createOrUpdateUserProfile(newUser);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        padding: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="hero-card"
        style={{
          width: "100%",
          maxWidth: 1120,
          padding: 26,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 22,
            alignItems: "start",
          }}
        >
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, rgba(17,24,39,0.9), rgba(99,102,241,0.18))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="subtitle" style={{ color: "#cbd5e1" }}>
              Crea tu cuenta
            </div>
            <h1 className="hero-title" style={{ marginTop: 14, lineHeight: 1.1 }}>
              Bienvenido a tu panel
            </h1>
            <p
              className="text-muted"
              style={{
                marginTop: 12,
                color: "#aab3c7",
                maxWidth: 520,
              }}
            >
              Regístrate para administrar productos, ventas y usuarios desde una
              plataforma segura y moderna.
            </p>

            <div
              style={{
                marginTop: 18,
                padding: 16,
                borderRadius: 20,
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="subtitle">Beneficios</div>
              <ul style={{ marginTop: 10, marginBottom: 0, paddingLeft: 18, color: "#e5e7eb" }}>
                <li style={{ marginTop: 6 }}>Administración por roles</li>
                <li style={{ marginTop: 6 }}>Seguridad con Firebase</li>
                <li style={{ marginTop: 6 }}>Acceso rápido y profesional</li>
              </ul>
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ textAlign: "center" }}>
              <div className="page-title" style={{ fontSize: 26 }}>
                Crear cuenta
              </div>
              <p className="text-muted" style={{ marginTop: 6 }}>
                Completa los datos para comenzar.
              </p>
            </div>

            <form onSubmit={handleRegister} style={{ marginTop: 16 }}>
              <div className="form-grid-2" style={{ marginTop: 6 }}>
                <label>
                  Nombre completo
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre completo"
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    required
                  />
                </label>
              </div>

              <label style={{ marginTop: 14 }}>
                Contraseña
                <div style={{ position: "relative", width: "100%", maxWidth: 420 }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Crea una contraseña segura"
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
                      width: "auto",
                      padding: "8px 10px",
                      borderRadius: 12,
                      boxShadow: "none",
                    }}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </label>

              <div className="form-grid-2" style={{ marginTop: 14 }}>
                <label>
                  Calle
                  <input
                    type="text"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="Calle"
                    required
                  />
                </label>
                <label>
                  Número
                  <input
                    type="text"
                    value={form.number}
                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                    placeholder="Número"
                    required
                  />
                </label>
              </div>

              <div className="form-grid-2" style={{ marginTop: 14 }}>
                <label>
                  Ciudad
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Ciudad"
                    required
                  />
                </label>
                <label>
                  Provincia
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    placeholder="Provincia"
                    required
                  />
                </label>
              </div>

              <div className="form-grid-2" style={{ marginTop: 14 }}>
                <label>
                  País
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="País"
                    required
                  />
                </label>
                <label>
                  Código Postal
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    placeholder="Código Postal"
                    required
                  />
                </label>
              </div>

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
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <p style={{ marginTop: 18, textAlign: "center" }}>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary" style={{ fontWeight: 900 }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

