import { useEffect, useMemo, useState, useRef } from "react";
import API from "../../services/api";
import UnifiedSearchFilter from "../../components/dashboard/UnifiedSearchFilter";
import EditUserModal from "./EditUserModal";

import {
  Users,
  UserPlus,
  Shield,
  Mail,
  ShieldCheck,
  MoreVertical,
  Trash2,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type User = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  createdAt: string;
};

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    dateFrom: "",
    dateTo: "",
  });
  const pageRef = useRef<HTMLDivElement>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ==========================================================================
  // LOAD USERS
  // ==========================================================================

  const loadUsers = async () => {
    setLoading(true);

    try {
      const res = await API.get<User[]>("/users");

      setUsers(res.data ?? []);
    } catch (err) {
      console.error("Error loading users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // Trigger animation
    const timer = setTimeout(() => {
      pageRef.current?.classList.add("visible");
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ==========================================================================
  // DELETE USER
  // ==========================================================================

  const handleDeleteUser = async (id: string) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este usuario?"
      )
    ) {
      return;
    }

    try {
      await API.delete(`/users/${id}`);

      setUsers((prev) =>
        prev.filter((u) => u._id !== id)
      );
    } catch (err) {
      console.error("Error deleting user:", err);

      alert(
        "Error al eliminar el usuario. Verifique sus permisos."
      );
    }
  };

  // ==========================================================================
  // EDIT ROLE
  // ==========================================================================

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveRole = async (
    userId: string,
    newRole: User["role"]
  ) => {
    try {
      await API.patch(`/users/${userId}`, {
        role: newRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, role: newRole }
            : u
        )
      );

      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      console.error(
        "Error updating user role:",
        err
      );

      alert(
        "Error al actualizar el rol del usuario."
      );
    }
  };

  // ==========================================================================
  // FILTERS
  // ==========================================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user?.name || ''} ${user?.lastName || ''}`.toLowerCase();

      const email = user?.email?.toLowerCase() || "";

      const role = user?.role?.toLowerCase() || "";

      const query =
        filters.searchQuery.toLowerCase();

      const createdAt = new Date(
        user.createdAt
      );

      const matchesSearch =
        fullName.includes(query) ||
        email.includes(query) ||
        role.includes(query) ||
        user._id.toLowerCase().includes(query);

      let matchesDate = true;

      if (filters.dateFrom) {
        matchesDate =
          matchesDate &&
          createdAt >=
            new Date(filters.dateFrom);
      }

      if (filters.dateTo) {
        const endDate = new Date(
          new Date(filters.dateTo).setHours(
            23,
            59,
            59,
            999
          )
        );

        matchesDate =
          matchesDate &&
          createdAt <= endDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [users, filters]);

  // ==========================================================================
  // KPI
  // ==========================================================================

  const totalUsers = filteredUsers.length;

  const adminCount = filteredUsers.filter(
    (u) =>
      u.role === "admin" ||
      u.role === "superadmin"
  ).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return "badge-danger";

      case "admin":
        return "badge-primary";

      default:
        return "badge-success";
    }
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div ref={pageRef} className="fade-in-up">
      <div className="container py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>
            <h1 className="page-title title-gradient">
              Gestión de Usuarios
            </h1>

            <p className="page-subtitle">
              Administra accesos y roles del sistema
            </p>
          </div>

          <button
            className="btn"
            style={{
              width: "auto",
              padding: "10px 24px",
            }}
          >
            <UserPlus size={18} />
            Registrar Usuario
          </button>
        </div>

        {/* FILTERS */}
        <UnifiedSearchFilter
          onSearch={setFilters}
        />

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          <div className="summary-card">
            <div className="flex items-center justify-between mb-4">

              <div
                className="brand-icon"
                style={{
                  width: "48px",
                  height: "48px",
                }}
              >
                <Users size={20} />
              </div>
            </div>

            <p className="text-muted-xs uppercase tracking-widest font-black">
              Usuarios Totales
            </p>

            <h2 className="title-md mt-1 font-bold">
              {totalUsers}
            </h2>
          </div>

          <div className="summary-card">
            <div className="flex items-center justify-between mb-4">

              <div
                className="brand-icon"
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(165, 180, 252, 0.25))",
                }}
              >
                <ShieldCheck
                  size={20}
                  className="text-primary"
                />
              </div>
            </div>

            <p className="text-muted-xs uppercase tracking-widest font-black">
              Administradores
            </p>

            <h2 className="title-md mt-1 font-bold">
              {adminCount}
            </h2>
          </div>
        </div>

        {/* TABLE */}
        <div className="card">
          <div className="table-container">

            {loading ? (
              <div className="p-10 text-center text-muted">
                Cargando equipo...
              </div>
            ) : (
              <table className="table">

                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol / Permisos</th>
                    <th>Fecha Alta</th>
                    <th className="text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center p-8 text-muted"
                      >
                        No hay usuarios que coincidan con la búsqueda
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >

                        <td>
                          <div className="font-bold text-white">
                            {user.name} {user.lastName}
                          </div>

                          <div className="text-muted-xs font-medium uppercase tracking-tighter">
                            UID: {user._id.slice(-8)}
                          </div>
                        </td>

                        <td>
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <Mail size={14} />
                            {user.email}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`badge ${getRoleBadge(
                              user.role
                            )} font-black uppercase tracking-wider`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="text-muted-sm">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </td>

                        <td className="text-right">
                          <div className="flex justify-end items-center gap-4">

                              {/* EDIT */}
                              <button
                                onClick={() =>
                                  handleEditUser(user)
                                }
                                className="text-muted hover:text-primary transition-colors"
                                title="Editar Rol"
                                style={{
                                  background: "none",
                                  boxShadow: "none",
                                  width: "auto",
                                  display: "inline",
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                <Shield size={18} />
                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    user._id
                                  )
                                }
                                className="text-muted hover:text-red-500 transition-colors"
                                title="Borrado Lógico"
                                style={{
                                  background: "none",
                                  boxShadow: "none",
                                  width: "auto",
                                  display: "inline",
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                <Trash2 size={18} />
                              </button>

                              {/* MORE */}
                              <button
                                className="text-muted hover:text-white"
                                style={{
                                  background: "none",
                                  boxShadow: "none",
                                  width: "auto",
                                  display: "inline",
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                <MoreVertical size={18} />
                              </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>
            )}

          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() =>
            setIsModalOpen(false)
          }
          onSave={handleSaveRole}
          isLoading={loading}
        />
      )}
    </div>
  );
};

export default UserPage;