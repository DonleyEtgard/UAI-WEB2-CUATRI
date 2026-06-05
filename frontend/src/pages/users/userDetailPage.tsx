import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
       const res = await API.get(`/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <p className="p-10 text-center">Cargando...</p>;
  if (!user) return <p className="p-10 text-center">Usuario no encontrado.</p>;

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Detalle de Usuario</h1>
      <div className="card space-y-4">
        <div className="grid grid-cols-2 gap-4 border-b pb-4">
          <p className="text-gray-500">ID de Firebase</p>
          <p className="font-mono text-xs">{user.firebaseUid}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-500">Nombre Completo</p>
          <p className="font-medium">{user.name} {user.lastName}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-500">Email</p>
          <p>{user.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-500">Rol Actual</p>
          <p className="capitalize font-bold text-blue-600">{user.role}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <p className="text-gray-500">Fecha de Registro</p>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <button className="btn-secondary mt-6" onClick={() => navigate("/users")}>Volver a la lista</button>
    </div>
  );
};

export default UserDetailPage;