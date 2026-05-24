// Clean RegisterPage implementation
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RegisterPage: React.FC = () => {
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

  useEffect(() => {
    return () => clearError?.();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError?.();
    if (formData.password !== formData.confirmPassword) {
      setFormError("Las contraseñas no coinciden");
      return;
    }
    try {
      setFormError(null);
      await register(
        formData.email.trim(), 
        formData.password,
        formData.name.trim(), 
        formData.lastName.trim(),
        formData.address.trim() || undefined, // street
        formData.city.trim() || undefined,
        formData.zipCode.trim() || undefined
      );
      navigate("/app/dashboard", { replace: true });
    } catch (err: any) {
      setFormError(err?.message || error || "Error al registrarse");
    }
  };

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
            <p className="haitibiz-subtitle">Create Professional Workspace</p>
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
                First Name
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
                Last Name
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
              Email Address
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
              Full Address
              <input
                id="address"
                name="address"
                type="text"
                placeholder="123 Street Name"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            <div className="form-grid-2">
              <label htmlFor="city">
                City
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
                Zip Code
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
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
                    style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, margin: 0 }}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
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
                  <span>Confirm</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300"
                    style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, margin: 0 }}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
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
              {isLoading ? "Provisioning Workspace..." : "Launch ERP Platform"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm font-medium">
            Back to Haitian platform?{" "}
            <button 
              onClick={() => navigate("/login")} 
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors underline underline-offset-4"
              style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, display: 'inline', transform: 'none' }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;