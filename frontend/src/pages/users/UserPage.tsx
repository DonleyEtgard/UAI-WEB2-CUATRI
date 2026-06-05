import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  plan?: string;
  isActive: boolean;
  createdAt?: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/users");

      setUsers(
        Array.isArray(res.data?.data?.users)
          ? res.data.data.users
          : []
      );
    } catch (err) {
      console.error("Error loading users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm(
      "¿Desea desactivar este usuario?"
    );

    if (!ok) return;

    try {
      setDeletingId(id);

      await API.delete(`/users/${id}`);

      setUsers((prev) =>
        prev.filter((u) => u._id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Error eliminando usuario");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (
  id: string,
  isActive: boolean
) => {
  try {
    await API.patch(`/users/${id}`, {
      isActive: !isActive,
    });

    loadUsers();
  } catch (err) {
    console.error(err);
    alert("Error actualizando usuario");
  }
};

  // KPI
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (u) => u.isActive
  ).length;

  const admins = users.filter(
    (u) =>
      u.role === "admin" ||
      u.role === "superadmin"
  ).length;

  const employees = users.filter(
    (u) => u.role === "employee"
  ).length;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#0f1115] text-white">

      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">

        <div>
          <h1 className="text-2xl font-bold">
            👥 Usuarios
          </h1>

          <p className="text-sm text-gray-400">
            Administración de usuarios,
            permisos y suscripciones
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/app/users/new")
          }
          className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
        >
          ➕ Nuevo Usuario
        </button>

      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">
            Total Usuarios
          </p>

          <h2 className="text-xl text-blue-400 font-bold">
            {totalUsers}
          </h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">
            Activos
          </p>

          <h2 className="text-xl text-green-400 font-bold">
            {activeUsers}
          </h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">
            Admins
          </p>

          <h2 className="text-xl text-yellow-400 font-bold">
            {admins}
          </h2>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-xs text-gray-400">
            Empleados
          </p>

          <h2 className="text-xl text-indigo-400 font-bold">
            {employees}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-gray-900 p-4 rounded-lg">

        <div className="flex justify-between items-center mb-4">

          <h2 className="font-bold text-lg">
            📋 Lista de Usuarios
          </h2>

          <button
            onClick={loadUsers}
             className="px-3 py-2 rounded-lg
             hover:bg-zinc-800 transition-colors
             text-zinc-400 hover:text-white text-sm"
             >
             🔄 Recargar
             </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-400">
            Cargando usuarios...
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b border-gray-700 text-gray-400">
                <tr>
                  <th className="text-left py-3">
                    Usuario
                  </th>

                  <th className="text-left py-3">
                    Email
                  </th>

                  <th className="text-left py-3">
                    Rol
                  </th>

                  <th className="text-left py-3">
                    Plan
                  </th>

                  <th className="text-left py-3">
                    Estado
                  </th>

                  <th className="text-right py-3">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>

                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-400"
                    >
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-800"
                    >
                      {/* USER */}
                      <td className="py-4">

                        <div className="font-semibold">
                          {u.name} {u.lastName}
                        </div>

                        <div className="text-xs text-gray-500">
                          ID #{u._id.slice(-6)}
                        </div>

                      </td>

                      {/* EMAIL */}
                      <td>
                        {u.email}
                      </td>

                      {/* ROLE */}
                      <td>
                        <span className="capitalize">
                          {u.role}
                        </span>
                      </td>

                      {/* PLAN */}
                      <td>
                        <span className="capitalize">
                          {u.plan || "free"}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            u.isActive
                              ? "bg-green-600/20 text-green-400"
                              : "bg-red-600/20 text-red-400"
                          }`}
                        >
                          {u.isActive
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="text-right">

                        <button
                          className="text-blue-400 hover:text-blue-300 mr-4"
                          onClick={() =>
                            navigate(
                              `/app/users/${u._id}`
                            )
                          }
                        >
                          Ver
                        </button>

                        <button
                          className="text-purple-400 hover:text-purple-300 mr-4"
                          onClick={() =>
                            navigate(
                              `/app/users/roles/${u._id}`
                            )
                          }
                        >
                          Rol
                        </button>

                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-4"
                          onClick={() =>
                            navigate(
                              `/app/users/edit/${u._id}`
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          disabled={
                            deletingId === u._id
                          }
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                          onClick={() =>
                            handleDelete(u._id)
                          }
                        >
                          {deletingId === u._id
                            ? "..."
                            : "Eliminar"}
                        </button>
                        <button
  className={
    u.isActive
      ? "text-red-400 hover:text-red-300 mr-4"
      : "text-green-400 hover:text-green-300 mr-4"
  }
  onClick={() =>
    handleToggleActive(
      u._id,
      u.isActive
    )
  }
>
  {u.isActive
    ? "Desactivar"
    : "Activar"}
</button>

                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default UserPage;