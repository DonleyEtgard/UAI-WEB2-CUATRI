import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get<User[]>("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await API.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <button className="btn-primary" onClick={() => navigate("/users/new")}>
          Nuevo Usuario
        </button>
      </div>

      <div className="border rounded bg-white overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">Cargando usuarios...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold">Email</th>
                <th className="p-3 font-semibold">Rol</th>
                <th className="p-3 font-semibold">Estado</th>
                <th className="p-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name} {u.lastName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button className="text-blue-600 hover:underline" onClick={() => navigate(`/users/${u._id}`)}>Ver</button>
                    <button className="text-purple-600 hover:underline" onClick={() => navigate(`/users/roles/${u._id}`)}>Rol</button>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(u._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserPage;