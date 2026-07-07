import * as userService from "../../services/users.service";

// ============================================================================
// API (re-exportar funciones del servicio como acciones del feature)
// ============================================================================

// 👤 Perfil del usuario actual
export const fetchMe = userService.getMe;

// 👥 Listado de usuarios
export const fetchUsers = userService.getUsers;

// 🔍 Usuario individual
export const fetchUserById = userService.getUserById;

// ✏️ Actualizar usuario
export const updateUserAction = userService.updateUser;

// ➕ Crear empleado
export const createEmployeeAction = userService.createEmployee;

// 🔄 Cambiar estado de activación
export const toggleUserStatusAction = userService.toggleUserActiveState;