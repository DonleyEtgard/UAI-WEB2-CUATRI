import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { Container, Box, Typography, Card, CardContent, Button, Avatar, Chip } from "@mui/material";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await API.get(`/customers/${id}`);
        setCustomer(res.data.data.customer);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!id || deleting) return;
    const ok = confirm("¿Eliminar cliente?");
    if (!ok) return;
    try {
      setDeleting(true);
      await API.delete(`/customers/${id}`);
      navigate("/app/customers");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, bgcolor: '#0f1115', minHeight: '100vh' }}>
      <Typography sx={{ color: '#9ca3af' }}>Cargando perfil...</Typography>
    </Box>
  );

  if (!customer) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, bgcolor: '#0f1115', minHeight: '100vh' }}>
      <Typography sx={{ color: '#ef4444' }}>Cliente no encontrado</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f1115', py: { xs: 2, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Header con Perfil */}
        <Card sx={{ bgcolor: '#111827', border: '1px solid #2b2d31', borderRadius: 4, mb: 4 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#6366f1', fontSize: '2rem', fontWeight: 800 }}>
                {customer.name[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>{customer.name} {customer.lastName}</Typography>
                  <Chip label={customer.debt > 0 ? "Deudor" : "Al día"} size="small" sx={{ bgcolor: customer.debt > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: customer.debt > 0 ? '#ef4444' : '#10b981', fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#9ca3af', fontFamily: 'monospace' }}>ID: {id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(`/app/customers/edit/${id}`)} sx={{ borderColor: '#2b2d31', color: 'white', '&:hover': { borderColor: '#e4e2e4' } }}>
                  Editar
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting} sx={{ fontWeight: 700 }}>
                  Eliminar
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Grid de Información */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Card sx={{ bgcolor: '#111827', border: '1px solid #2b2d31', borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Datos de Contacto
                </Typography>
                <Box sx={{ spaceY: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="overline" sx={{ color: '#9ca3af', display: 'block' }}>Email</Typography>
                    <Typography variant="body1" sx={{ color: '#e4e2e4', fontWeight: 500 }}>{customer.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="overline" sx={{ color: '#9ca3af', display: 'block' }}>Teléfono</Typography>
                    <Typography variant="body1" sx={{ color: '#e4e2e4', fontWeight: 500 }}>{customer.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#9ca3af', display: 'block' }}>Dirección registrada</Typography>
                    <Typography variant="body1" sx={{ color: '#e4e2e4', fontWeight: 500 }}>{customer.address || "No especificada"}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card sx={{ bgcolor: '#111827', border: '1px solid #2b2d31', borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
                  Resumen Financiero
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="overline" sx={{ color: '#9ca3af' }}>Saldo Pendiente</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: customer.debt > 0 ? '#ef4444' : '#10b981', mt: 1 }}>
                    ${(customer.debt || 0).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Button 
          onClick={() => navigate("/app/customers")}
          sx={{ mt: 4, color: '#9ca3af', '&:hover': { color: 'white' } }}
        >
          ← Volver al listado
        </Button>
      </Container>
    </Box>
  );
};

export default CustomerDetail;