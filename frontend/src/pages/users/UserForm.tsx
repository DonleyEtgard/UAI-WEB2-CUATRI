import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import type { AppUser } from "../../types/firestore";

// =========================
// COMPONENT
// =========================
const UserForm = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee" as AppUser["role"],
    isActive: true,
    plan: "free" as AppUser["plan"],
  });

  const [loading, setLoading] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // =========================
  // RBAC
  // =========================
  const canCreateUsers =
    currentUser?.role === "admin" ||
    currentUser?.role === "superadmin";

  const canAssignRole = (role: AppUser["role"]) => {
    if (currentUser?.role === "superadmin") return true;
    if (currentUser?.role === "admin") {
      return role === "employee"; // admin SOLO employee
    }
    return false;
  };

  // =========================
  // CHANGE
  // =========================
  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================
  // VALIDATION
  // =========================
  const validate = () => {
    if (!canCreateUsers) {
      alert("No tienes permisos");
      return false;
    }

    if (
      !form.name ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.role
    ) {
      alert("Completa todos los campos");
      return false;
    }

    if (!canAssignRole(form.role)) {
      alert("No puedes asignar este rol");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT FIREBASE
  // =========================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      
      // El backend ahora maneja la creación en Firebase Admin y MongoDB
      await API.post("/users", form);

      alert("User created successfully");
      navigate("/users");
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GUARD
  // =========================
  if (!canCreateUsers) {
    return (
      <div className="container p-6">
        <div className="card text-red-500 text-center">
          No tienes permisos para crear usuarios
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div ref={pageRef} className="container fade-in-up">
      <div className="card space-y-6">

        <div>
          <h1 className="text-xl font-bold">
            Crear Usuario
          </h1>
          <p className="text-gray-400 text-sm">
            Gestión de usuarios con Firebase
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            className="input w-full"
            placeholder="Nombre (First Name)"
            value={form.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
          />

          <input
            className="input w-full"
            placeholder="Apellido (Last Name)"
            value={form.lastName}
            onChange={(e) =>
              handleChange("lastName", e.target.value)
            }
          />

          <input
            className="input w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
          />

          <input
            className="input w-full"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
          />

          {/* ROLE RBAC */}
          <select
            className="input w-full"
            value={form.role}
            onChange={(e) =>
              handleChange(
                "role",
                e.target.value as AppUser["role"]
              )
            }
          >
            <option value="employee">Employee</option>

            {currentUser?.role === "superadmin" && (
              <>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </>
            )}
          </select>

          {/* PLAN */}
          <select
            className="input w-full"
            value={form.plan}
            onChange={(e) =>
              handleChange("plan", e.target.value)
            }
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserForm;