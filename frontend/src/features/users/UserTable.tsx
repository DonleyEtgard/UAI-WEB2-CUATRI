import { useEffect, useState } from "react";
import { getUsers, toggleUserStatus } from "./api";
import type { User } from "./api";

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔄 cargar usuarios
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 🔄 activar / desactivar
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      setActionLoading(id);
      await toggleUserStatus(id, isActive);
      await loadUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ⏳ loading global
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Cargando usuarios...
      </div>
    );
  }

  // ❌ error
  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );
  }

  // 📭 empty
  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        No hay usuarios
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          
          {/* HEADER */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* EMAIL */}
                <td className="p-3">{user.email}</td>

                {/* ROLE */}
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {user.role}
                  </span>
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Activo" : "Desactivado"}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <button
                    onClick={() => handleToggle(user._id, user.isActive)}
                    disabled={actionLoading === user._id}
                    className={`px-3 py-1 rounded text-white text-xs transition ${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } ${
                      actionLoading === user._id
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {actionLoading === user._id
                      ? "Procesando..."
                      : user.isActive
                      ? "Desactivar"
                      : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default UserTable;