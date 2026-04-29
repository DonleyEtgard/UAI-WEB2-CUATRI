import API from "../../api/axios";
import { useState, useEffect } from "react";
import { toggleUserStatus } from "../users/api";

type User = {
  _id: string;
  email: string;
  role: "superadmin" | "admin" | "seller";
  isActive: boolean;
};

const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users"); // ⚠️ necesitás esta ruta en backend
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await toggleUserStatus(id);
      loadUsers(); // 🔄 refresca
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

              <td className="p-2">
                <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                  {user.role}
                </span>
              </td>

              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Disabled"}
                </span>
              </td>

              <td className="p-2">
                <button
                  onClick={() => handleToggle(user._id)}
                  className={`px-3 py-1 rounded text-white ${
                    user.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
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