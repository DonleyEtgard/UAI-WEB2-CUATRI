import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

type Address = {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

type User = {
  _id: string;
  email: string;
  role: "admin" | "employee";
  isActive: boolean;
  plan: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  address?: Address;
};

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const res = await API.get(`/users/${id}`);
    setUser(res.data);
  };

  const handleToggle = async () => {
    if (!user) return;
    await API.patch(`/users/${user._id}/toggle-status`);
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container space-y-6">

      {/* HEADER */}
      <div className="card flex justify-between items-center">
        <div>
          <h1>{user.email}</h1>
          <p className="text-gray-400 capitalize">{user.role}</p>
        </div>

        <button
          onClick={handleToggle}
          className={`btn ${
            user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {user.isActive ? "Disable" : "Enable"}
        </button>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-4">

        <div className="card">
          <p className="text-gray-400">Status</p>
          <p>{user.isActive ? "Active" : "Inactive"}</p>
        </div>

        <div className="card">
          <p className="text-gray-400">Role</p>
          <p className="capitalize">{user.role}</p>
        </div>

        <div className="card">
          <p className="text-gray-400">Plan</p>
          <p>{user.plan}</p>
        </div>

        <div className="card">
          <p className="text-gray-400">Subscription</p>
          <p className="text-sm">
            {user.subscriptionStart
              ? new Date(user.subscriptionStart).toLocaleDateString()
              : "-"}{" "}
            →{" "}
            {user.subscriptionEnd
              ? new Date(user.subscriptionEnd).toLocaleDateString()
              : "-"}
          </p>
        </div>

      </div>

      {/* ADDRESS */}
      <div className="card">
        <h2>Address</h2>

        {user.address ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>Street: {user.address.street || "-"}</p>
            <p>Number: {user.address.number || "-"}</p>
            <p>City: {user.address.city || "-"}</p>
            <p>State: {user.address.state || "-"}</p>
            <p>Country: {user.address.country || "-"}</p>
            <p>Postal Code: {user.address.postalCode || "-"}</p>
          </div>
        ) : (
          <p className="text-gray-500">No address provided</p>
        )}
      </div>

    </div>
  );
};

export default UserDetailPage;