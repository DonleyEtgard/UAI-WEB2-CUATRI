import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { toggleUserStatus } from "../../services/users.service";

type User = {
  _id: string;
  email: string;
  role: string;
  isActive: boolean;
  plan: string;
};

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error loading users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleUserStatus(id);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container space-y-6">

      {/* HEADER */}
      <div className="flex-between">
        <div>
          <h1>Users</h1>
          <p className="text-muted">
            Manage system users and permissions
          </p>
        </div>

        <Link to="/users/new" className="btn">
          + New User
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="card">

        {loading ? (
          <p className="text-muted">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="text-center text-muted">
            No users found
          </div>
        ) : (
          <div className="table-container">
            <table className="table">

              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Role</th>
                  <th className="table-header-cell">Plan</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="table-row"
                  >
                    <td className="table-cell">{user.email}</td>

                    <td className="table-cell-capitalize">
                      {user.role}
                    </td>

                    <td className="table-cell">
                      <span className="badge badge-primary">
                        {user.plan}
                      </span>
                    </td>

                    <td className="table-cell">
                      <span className={user.isActive ? "badge badge-success" : "badge badge-danger"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="table-cell">
                      <div className="flex-end">

                        <Link
                          to={`/users/${user._id}`}
                          className="btn-secondary"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => handleToggle(user._id)}
                          className="btn"
                        >
                          {user.isActive ? "Disable" : "Enable"}
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default UserPage;