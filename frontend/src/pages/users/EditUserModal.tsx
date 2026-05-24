import React, { useState, useEffect } from "react";
import { X, UserCheck } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

type UserRole = "superadmin" | "admin" | "employee";

interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, newRole: UserRole) => Promise<void>;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  onClose,
  onSave,
  isLoading,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  useEffect(() => {
    setSelectedRole(user.role);
  }, [user.role]);

  const handleSave = async () => {
    await onSave(user._id, selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="form-container relative w-full max-w-md p-8 animate-in zoom-in-90 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-white transition-colors"
          style={{ background: 'none', boxShadow: 'none', width: 'auto', padding: 0, margin: 0 }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="title-md text-white">Editar Rol de Usuario</h2>
          <p className="text-muted-sm mt-1">Ajusta los permisos de acceso para {user.name} {user.lastName}</p>
        </div>

        {/* User Info */}
        <div className="mb-6 space-y-2">
          <p className="text-sm text-muted">
            <span className="font-semibold text-white">Email:</span> {user.email}
          </p>
          <p className="text-sm text-muted">
            <span className="font-semibold text-white">ID:</span> {user._id}
          </p>
        </div>

        {/* Role Selection Form */}
        <div className="space-y-4">
          <label htmlFor="role-select">
            Seleccionar Nuevo Rol
            <select
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              disabled={isLoading}
            >
              <option value="employee">Empleado</option>
              <option value="admin">Administrador</option>
              <option value="superadmin">Super Administrador</option>
            </select>
          </label>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading || selectedRole === user.role}
              className="btn"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <>
                  <UserCheck size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;