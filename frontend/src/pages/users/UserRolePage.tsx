import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const UserRolePage = () => {
  const { id } = useParams();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/users/${id}`).then(res => {
      setRole(res.data.role);
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await API.patch(`/users/${id}`, { role });
      alert("Rol actualizado");
      navigate("/users");
    } catch (err) {
      alert("Error al actualizar rol");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Cargando...</p>;

  return (
    <div className="container max-w-md py-8">
      <h1 className="text-2xl font-bold mb-6">Gestionar Rol</h1>
      <div className="card space-y-6">
        <div>
          <label className="text-sm font-medium">Seleccionar nuevo rol</label>
          <select 
            className="input w-full mt-2" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Empleado</option>
            <option value="admin">Administrador</option>
            <option value="superadmin">Super Administrador</option>
          </select>
        </div>
        <p className="text-xs text-gray-500 italic">
          Nota: El cambio de rol afecta los permisos de acceso de forma inmediata en el backend.
        </p>
        <div className="flex gap-4">
          <button className="btn-primary flex-1" onClick={handleUpdate} disabled={saving}>
            {saving ? "Guardando..." : "Actualizar Rol"}
          </button>
          <button className="btn-secondary" onClick={() => navigate("/users")}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default UserRolePage;