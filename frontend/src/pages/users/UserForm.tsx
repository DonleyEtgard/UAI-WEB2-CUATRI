import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import type { AppUser } from "../../types/firestore";

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee" as AppUser["role"],
    isActive: true,
    plan: "free" as AppUser["plan"],
  });

  // =========================
  // RBAC
  // =========================

  const canManageUsers =
    currentUser?.role === "admin" ||
    currentUser?.role === "superadmin";

  const canAssignRole = (role: AppUser["role"]) => {
    if (currentUser?.role === "superadmin") {
      return ["admin", "employee", "client"].includes(role);
    }
    if (currentUser?.role === "admin") {
      return ["employee", "client"].includes(role);
    }
    return false;
  };

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        setLoadingUser(true);

        const res = await API.get(`/users/${id}`);

        const user = res.data.data.user;

        setForm({
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          password: "",
          role: user.role || "employee",
          isActive: user.isActive ?? true,
          plan: user.plan || "free",
        });
      } catch (err) {
        console.error(err);
        alert("Error cargando usuario");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [id]);

  // =========================
  // CHANGE
  // =========================

  const handleChange = (
    key: string,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    if (!canManageUsers) {
      alert("No tienes permisos");
      return false;
    }

    if (
      !form.name ||
      !form.lastName ||
      !form.email
    ) {
      alert("Completa todos los campos");
      return false;
    }

    if (!isEdit && !form.password) {
      alert("Password requerida");
      return false;
    }

    if (!canAssignRole(form.role)) {
      alert("No puedes asignar este rol");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      if (isEdit) {
        await API.patch(`/users/${id}`, {
          name: form.name,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
          plan: form.plan,
          isActive: form.isActive,
        });

        alert("Usuario actualizado");
      } else {
        await API.post("/users/employees", {
          name: form.name,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: form.role,
          plan: form.plan,
          isActive: form.isActive,
        });

        alert("Usuario creado");
      }

      navigate("/app/users");

    } catch (err) {
      console.error(err);
      alert(
        isEdit
          ? "Error actualizando usuario"
          : "Error creando usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GUARD
  // =========================

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-8 border-2 border-dashed border-zinc-800 rounded-3xl m-8">
        <div className="text-center">
          <div className="bg-rose-500/10 p-3 rounded-full text-rose-500 inline-block mb-4 italic font-bold">⚠️</div>
          <h2 className="text-xl font-bold text-white">Acceso Denegado</h2>
          <p className="text-zinc-500 mt-1">No tienes permisos para gestionar el equipo.</p>
        </div>
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-10 text-zinc-500">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Cargando perfil...</p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isEdit ? "Editar Perfil" : "Nuevo Integrante"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Configura la información de acceso y privilegios.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Nombre</label>
              <input
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600"
                placeholder="Ej. John"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Apellido</label>
              <input
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600"
                placeholder="Ej. Doe"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Correo Electrónico</label>
            <input
              className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-zinc-600"
              placeholder="john@empresa.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Contraseña</label>
              <input
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Rol Administrativo</label>
              <select
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white appearance-none cursor-pointer"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value as AppUser["role"])}
              >
                <option value="employee">Empleado</option>
              <option value="client">Cliente / Usuario</option>
                {currentUser?.role === "superadmin" && (
                <option value="admin">Administrador</option>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Plan de Suscripción</label>
              <select
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-white appearance-none cursor-pointer"
                value={form.plan}
                onChange={(e) => handleChange("plan", e.target.value)}
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="group flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
                <div className="w-10 h-5 bg-zinc-800 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                Usuario activo y con acceso al sistema
              </span>
            </label>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/30 border-t border-zinc-800 flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
            onClick={() => navigate("/app/users")}
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/10 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
            {loading ? "Guardando..." : isEdit ? "Actualizar Usuario" : "Crear Usuario"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;