import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, Container, Avatar, Button, Chip, Typography } from "@mui/material";
import API from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";


const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
       const res = await API.get(`/users/${id}`);
        setUser(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 600, width: '100%' }}>
        <SkeletonLoader count={5} height={40} />
      </Box>
    </Box>
  );

 if (!user) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 10,
        minHeight: "100vh",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <EmptyState
          title="Usuario no encontrado"
          description="Este usuario no existe o fue eliminado."
        />
      </Box>
    </Box>
  );
}

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 90, height: 90, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '2.5rem', fontWeight: 800, border: '3px solid white' }}>
                {user.name ? user.name[0] : 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{user.name} {user.lastName}</Typography>
                  <Chip label={user.role || 'user'} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', opacity: 0.9 }}>Firebase UID: {user.firebaseUid || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(`/app/users/edit/${id}`)} sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  Editar
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          {/* Main Info */}
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader title="Información Personal" sx={{ pb: 1 }} />
            <CardContent>
              <Box sx={{ spaceY: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Email</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{user.email}</Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Rol</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5, textTransform: 'capitalize' }}>{user.role}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Fecha de Registro</Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardHeader title="Estado" sx={{ pb: 1 }} />
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Chip 
                  label={user.isActive ? 'Activo' : 'Inactivo'} 
                  color={user.isActive ? 'success' : 'error'} 
                  variant="filled" 
                  sx={{ mb: 2, fontSize: 14, fontWeight: 700, p: '20px 12px' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Button 
          onClick={() => navigate("/app/users")}
          sx={{ mt: 4, color: '#64748b', '&:hover': { color: 'text.primary' } }}
        >
          ← Volver al listado
        </Button>
      </Container>
    </Box>
  );
};

export default UserDetailPage;