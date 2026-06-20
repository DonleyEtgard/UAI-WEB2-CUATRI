import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, CardHeader, Button, Chip } from "@mui/material";
import API from "../../services/api";
import DataGridWrapper from "../../components/common/DataGridWrapper";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import UiBadge from "../../components/common/UiBadge";

interface User {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;

  plan?: string;
  subscriptionStatus?: string;
  subscriptionPaid?: boolean;
  subscriptionEnd?: string;

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
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: '100vh' }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
        <Box>
          <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0}}>👥 Usuarios</h1>
          <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>Administración de usuarios, permisos y suscripciones.</p>
        </Box>
        <Button variant="contained" color="primary" onClick={() => navigate("/app/users/new")} sx={{textTransform: 'none', fontSize: 16, boxShadow: 2}}>Nuevo Usuario</Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{mb: 4}}>
        {[{label: 'Total Usuarios', value: totalUsers}, {label: 'Activos', value: activeUsers}, {label: 'Admins', value: admins}, {label: 'Empleados', value: employees}].map((kpi, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card>
              <CardContent>
                <p style={{fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', margin: 0}}>{kpi.label}</p>
                <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', marginTop: '0.5rem', margin: 0}}>{kpi.value}</h2>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TABLE */}
      <Card>
        <CardHeader title="Lista de Usuarios" action={<Button onClick={loadUsers} size="small">🔄 Recargar</Button>} />
        <CardContent sx={{p: 0}}>
          {loading ? (
            <Box sx={{p: 2}}>
              <SkeletonLoader count={6} height={48} />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{p: 4}}>
              <EmptyState title="No hay usuarios" description="Crea tu primer usuario para comenzar." actionLabel="Crear usuario" onAction={() => navigate("/app/users/new")} />
            </Box>
          ) : (
            <DataGridWrapper
              rows={users.map(u => ({ ...u, id: u._id }))}
              columns={[
                {field: 'name', headerName: 'Usuario', flex: 1, renderCell: (params: any)=> (
                  <Box style={{display:'flex', alignItems:'center', gap:12}}>
                    <Box style={{width:40, height:40, borderRadius:'50%', background:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:12, textTransform:'uppercase'}}>
                      {params.row.name[0]}
                    </Box>
                    <Box>
                      <div style={{fontWeight:600, color:'#fff'}}>{params.row.name} {params.row.lastName}</div>
                      <div style={{fontSize:10, color:'#9ca3af', fontFamily:'monospace'}}>ID: {params.row._id.slice(-6)}</div>
                    </Box>
                  </Box>
                )},
                {field: 'email', headerName: 'Email', flex: 1},
                {field: 'role', headerName: 'Rol', width: 140, renderCell: (params: any)=> <Chip label={params.value || 'N/A'} size="small" variant="outlined" />},
                {field: 'plan', headerName: 'Plan', width: 120, renderCell: (params: any)=> <Chip label={params.value || 'free'} size="small" />},
                {field: 'isActive', headerName: 'Estado', width: 140, renderCell: (params: any)=> params.value ? <UiBadge label='Activo' color='success' /> : <UiBadge label='Inactivo' color='error' />},
                {field: 'actions', headerName: 'Acciones', width: 200, sortable: false, renderCell: (params: any)=> (
                  <Box style={{display:'flex', gap:6, justifyContent:'flex-end', width:'100%', fontSize:12}}>
                    <button onClick={() => navigate(`/app/users/${params.row._id}`)} style={{background:'transparent', border:0, padding:4, borderRadius:6, color:'#6366f1', cursor:'pointer', textDecoration:'underline'}}>Ver</button>
                    <button onClick={() => navigate(`/app/users/edit/${params.row._id}`)} style={{background:'transparent', border:0, padding:4, borderRadius:6, color:'#8b5cf6', cursor:'pointer', textDecoration:'underline'}}>Editar</button>
                    <button onClick={() => handleToggleActive(params.row._id, params.row.isActive)} style={{background:'transparent', border:0, padding:4, borderRadius:6, color:'#f59e0b', cursor:'pointer', textDecoration:'underline'}}>{params.row.isActive ? 'Desactivar' : 'Activar'}</button>
                    <button onClick={() => handleDelete(params.row._id)} disabled={deletingId === params.row._id} style={{background:'transparent', border:0, padding:4, borderRadius:6, color:'#ef4444', cursor:'pointer', textDecoration:'underline'}}>{deletingId === params.row._id ? '...' : 'Eliminar'}</button>
                  </Box>
                )},
              ]}
              pageSize={10}
              onRowClick={(params:any)=> navigate(`/app/users/${params.row._id}`)}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserPage;