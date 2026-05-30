import { useState, useEffect, useCallback } from "react";
import { 
  fetchMe, 
  fetchUsers, 
  fetchUserById, 
  updateUserAction, 
  createEmployeeAction 
} from "./api";
import type { User, UpdateUserData, CreateEmployeeData } from "./types";

// ==========================
// HOOK: useMe (Perfil actual)
// ==========================
export const useMe = () => {
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMe();
      setMe(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { me, loading, error, reload };
};

// ==========================
// HOOK: useUsers (Listado)
// ==========================
export const useUsers = (page = 1, limit = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(page, limit);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { reload(); }, [reload]);

  return { users, total, loading, reload };
};

// ==========================
// HOOK: useUser (Individual)
// ==========================
export const useUser = (id?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await fetchUserById(id);
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { reload(); }, [reload]);

  return { user, loading, reload };
};

// ==========================
// HOOK: useUserActions
// ==========================
export const useUserActions = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (id: string, data: UpdateUserData) => {
    setLoading(true);
    try {
      return await updateUserAction(id, data);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (data: CreateEmployeeData) => {
    setLoading(true);
    try {
      return await createEmployeeAction(data);
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, handleCreateEmployee, loading };
};