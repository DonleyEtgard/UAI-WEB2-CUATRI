import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Grid, Card, CardContent, CardHeader, Button, Chip } from "@mui/material";
import * as API from "../../services/users.service";
import DataGridWrapper from "../../components/common/DataGridWrapper";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import UiBadge from "../../components/common/UiBadge";


interface User {
   _id: string;
    name: string;
    lastName: string;
    email: string;

    role: string;

    plan?: string;

    paymentStatus?: API.PaymentStatus;

    subscriptionStatus?: string;

    subscriptionPaid?: boolean;

    subscriptionEnd?: string;

    ownerAdmin?: string;

    isActive: boolean;
    createdAt?: string;
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await API.getUsers();

      setUsers(
        Array.isArray(res.data?.users)
          ? res.data.users
          : []
      );
    } catch (err) {
      console.error(t("users.page.loadError"), err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);


    const handlePaymentStatus = async (
    id: string,
    status: API.PaymentStatus
     ) => {
    try {

        await API.updateUser(id, {
            paymentStatus: status,
        });

        await loadUsers();

    } catch (err) {

        console.error(err);

        alert(
            t("users.page.errorUpdatingUser")
        );

    }
    };

  const handleDelete = async (
  id: string
) => {

  const ok = confirm(
    t("users.page.confirmDeactivate")
  );

  if (!ok) return;

  try {

    setDeletingId(id);

    await API.toggleUserActiveState(id);

    await loadUsers();

  } catch (err) {

    console.error(err);

    alert(
      t("users.page.errorUpdatingStatus")
    );

  } finally {

    setDeletingId(null);

  }
};

 const handleToggleActive = async (
  id: string
) => {
  try {
    await API.toggleUserActiveState(id);

    await loadUsers();

  } catch (err) {
    console.error(err);
    alert(t("users.page.errorUpdatingUser"));
  }
};

  const canPerformActionOn = (targetUser: User) => {
    if (!currentUser) return false;

    // Superadmin can manage admins and employees, but not other superadmins.
    if (currentUser.role === 'superadmin') {
      return targetUser.role === 'admin' || targetUser.role === 'employee';
    }

    // Admin can only manage employees they created.
    if (currentUser.role === 'admin') {
      return targetUser.role === 'employee' && targetUser.ownerAdmin === currentUser._id;
    }
    return false;
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
          <h1 style={{fontSize: '2rem', fontWeight: 'bold', color: 'white', margin: 0}}>👥 {t("users.page.title")}</h1>
          <p style={{fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem'}}>{t("users.page.subtitle")}</p>
        </Box>
        <Button variant="contained" color="primary" onClick={() => 
          navigate("/app/users/new")} sx={{textTransform: 'none', fontSize: 16, boxShadow: 2}}>
            {t("users.page.newUser")}</Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{mb: 4}}>
        {[{label: t("users.page.totalUsers"), value: totalUsers}, {label: t("users.page.activeUsers"), value: activeUsers}, {label: t("users.page.admins"), value: admins}, {label: t("users.page.employees"), value: employees}].map((kpi, i) => (
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
        <CardHeader title={t("users.page.userList")} action={<Button onClick={loadUsers} size="small">🔄 </Button>} />
        <CardContent sx={{p: 0}}>
          {loading ? (
            <Box sx={{p: 2}}>
              <SkeletonLoader count={6} height={48} />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{p: 4}}>
              <EmptyState title={t("users.page.noUsers")} description={t("users.page.noUsersDescription")} actionLabel={t("users.page.createUser")} onAction={() => navigate("/app/users/new")} />
            </Box>
          ) : (
            <DataGridWrapper
              rows={users.map(u => ({ ...u, id: u._id }))}
              columns={[
                {field: 'name', headerName: t("users.page.user"), flex: 1, renderCell: (params: any)=> (
                  <Box style={{display:'flex', alignItems:'center', gap:12}}>
                    <Box style={{width:40, height:40, borderRadius:'50%', background:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:12, textTransform:'uppercase'}}>
                      {params.row.name[0]}
                    </Box>
                    <Box>
                      <div style={{fontWeight:600, color:'black'}}>{params.row.name} {params.row.lastName}</div>
                      <div style={{fontSize:10, color:'#9ca3af', fontFamily:'monospace'}}>ID: {params.row._id.slice(-6)}</div>
                    </Box>
                  </Box>
                )},
                {field: 'email', headerName: t("users.page.email"), flex: 1},
                {field: 'role', headerName: t("users.page.role"), width: 120, renderCell: (params: any)=> <Chip label={params.value || t("users.page.notAvailable")} size="small" variant="outlined" />},
                {field: 'plan', headerName: t("users.page.plan"), width: 100, renderCell: (params: any)=> <Chip label={params.value || t("users.page.free")} size="small" />},
                {field: 'isActive', headerName: t("users.page.status"), width: 100, renderCell: (params: any)=> params.value ? <UiBadge label={t("users.page.active")} color='success' /> : <UiBadge label={t("users.page.inactive")} color='error' />},
                {field: 'actions', headerName: t("users.page.actions"), width: 280, sortable: false, renderCell: (params: any)=> (
                  <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
                    {canPerformActionOn(params.row) && (
                      <>
                        <Button size="small" variant="outlined" sx={{ minWidth: 32 }} onClick={(e) => { e.stopPropagation(); navigate(`/app/users/edit/${params.row._id}`); }}>
                          ✏️
                        </Button>
                       <Button
                       size="small"
                       variant="outlined"
                     color={
                   params.row.isActive
                  ? "warning": "success"
                  }
              onClick={(e) => { e.stopPropagation(); handleToggleActive( params.row._id );
                 }}
                 sx={{ minWidth: 32 }}
                  >
                  {params.row.isActive
                  ? "🚫" : "✅"}
                   </Button>
                      </>
                    )}
                    {currentUser?.role === 'superadmin' && params.row.role !== 'superadmin' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={deletingId === params.row._id}
                        onClick={(e) => { e.stopPropagation(); handleDelete(params.row._id); }}
                        sx={{ minWidth: 32 }}
                      >
                        {deletingId === params.row._id ? t("users.page.loading") : '🗑️'}
                      </Button>
                    )}

              <Button
                size="small"
              color="success"
              variant="outlined"
              sx={{ minWidth: 32 }}
            onClick={(e)=>{
            e.stopPropagation();

            handlePaymentStatus(
            params.row._id,
            "paid"
           );
 
            }}
          >
           $
           </Button>

                <Button
                size="small"
                color="error"
                 variant="outlined"
                 sx={{ minWidth: 32 }}
                 onClick={(e)=>{
                e.stopPropagation();

              handlePaymentStatus(
             params.row._id,
             "unpaid"
            );

          }}
         >
         ✖
        </Button>

          <Button
            size="small"
            color="warning"
            variant="outlined"
            sx={{ minWidth: 32 }}
            onClick={(e)=>{
            e.stopPropagation();

             handlePaymentStatus(
             params.row._id,
              "pending"
              );

            }}
           >
          ⏳
          </Button>
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