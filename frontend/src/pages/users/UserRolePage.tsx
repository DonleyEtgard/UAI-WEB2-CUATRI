import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserRolePage = () => {
  const { id } = useParams();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const res = await API.get(`/users/${id}`);

        // según tu backend puede venir en data.user o data
        const user = res.data.user || res.data;

        setRole(user.role || "employee");
      } catch (err) {
        console.error("Error loading user:", err);
        alert("No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;

    setSaving(true);

    try {
      await API.patch(`/users/${id}`, { role });

      alert("Rol actualizado");
      navigate("/app/users");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar rol");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Cargando...</p>;
  }

  if (!id) {
    return (
      <p className="p-10 text-center text-red-500">
        ID de usuario no encontrado
      </p>
    );
  }

  return (
    <div className="container max-w-md py-8">
      <h1 className="text-2xl font-bold mb-6">Gestionar Rol</h1>

      <div className="card space-y-6">
        <div>
          <label className="text-sm font-medium">
            Seleccionar nuevo rol
          </label>

          <select
            className="input w-full mt-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Empleado</option>
            <option value="client">Cliente / Usuario</option>
            {currentUser?.role === "superadmin" && (
              <option value="admin">Administrador</option>
            )}
          </select>
        </div>

        <p className="text-xs text-gray-500 italic">
          Nota: El cambio de rol afecta los permisos de acceso inmediatamente.
        </p>

        <div className="flex gap-4">
          <button
            className="btn-primary flex-1"
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Actualizar Rol"}
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/app/users")}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRolePage;