import { useState, useEffect } from "react";
import API from "../../services/api";

type User = {
  _id: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  isActive: boolean;
};

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

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
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await API.patch(`/users/${id}/toggle-status`);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Users</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.email}</td>

              <td className="p-2">{user.role}</td>

              <td className="p-2">
                {user.isActive ? "Active" : "Disabled"}
              </td>

              <td className="p-2">
                <button
                  onClick={() => handleToggle(user._id)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;