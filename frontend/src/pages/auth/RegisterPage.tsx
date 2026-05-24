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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      
      <div className="w-full max-w-[560px] z-10">
        <div className="glass-morphism rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Workspace</h1>
            <p className="text-slate-400 mt-2">Scale your business with professional tools</p>
          </div>

          {(formError || error) && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in zoom-in duration-300">
              <span className="font-bold">Error:</span> {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">First Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="erp-input"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="erp-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="erp-input"
                required
              />
            </div>

            {/* ADDRESS SECTION */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Full Address</label>
              <input
                name="address"
                type="text"
                placeholder="123 Street Name"
                value={formData.address}
                onChange={handleChange}
                className="erp-input mb-3"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="erp-input"
                  required
                />
                <input
                  name="zipCode"
                  type="text"
                  placeholder="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="erp-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="erp-input"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase">Confirm</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="erp-input"
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="erp-button-primary mt-6">
              {isLoading ? "Provisioning..." : "Launch ERP Workspace"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-400 text-sm font-medium">
            Back to Haitian platform?{" "}
            <button onClick={() => navigate("/login")} className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 transition-all">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;