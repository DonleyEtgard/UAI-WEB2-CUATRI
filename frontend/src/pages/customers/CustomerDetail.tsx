import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { Container, Box, Typography, Card, CardContent, CardHeader, Button, Avatar, Chip, TextField, InputAdornment } from "@mui/material";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await API.get(`/customers/${id}`);
        // El backend devuelve el objeto directamente
        console.log("DEBUG: Customer Detail Loaded:", res.data);
        setCustomer(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomer();
  }, [id]);

  const handleAddPayment = async () => {
    if (!id || !newPaymentAmount || Number(newPaymentAmount) <= 0) {
      alert("Por favor, ingrese un monto válido.");
      return;
    }

    try {
      setPaymentLoading(true);
      const res = await API.post(`/customers/${id}/payment`, {
        amount: Number(newPaymentAmount),
      });
      setCustomer(res.data); // Actualiza el estado del cliente con la respuesta
      setNewPaymentAmount(""); // Limpia el input
    } catch (err) {
      console.error("Error adding payment:", err);
      alert("Hubo un error al registrar el pago.");
    } finally {
      setPaymentLoading(false);
    }
  };

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
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #e0e7ff', borderTop: '4px solid #4f46e5', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }}></div>
        <Typography sx={{ color: '#94a3b8' }}>Cargando perfil...</Typography>
      </Box>
    </Box>
  );

  if (!customer) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 600 }}>Cliente no encontrado</Typography>
        <Button onClick={() => window.history.back()} sx={{ mt: 2 }}>Volver</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header con Perfil */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 3 }}>
              <Avatar sx={{ width: 90, height: 90, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '2.5rem', fontWeight: 800, border: '3px solid white' }}>
                {customer.name?.[0] || '?'}
              </Avatar>
              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mb: 0.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Nombre del Cliente</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'white' }}>{customer.name}</Typography>
                  </Box>
                  <Chip label={customer.isActive ? "Activo" : "Inactivo"} size="small" sx={{ bgcolor: customer.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: customer.isActive ? '#10b981' : '#ef4444', fontWeight: 700 }} />
                </Box>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', opacity: 0.9 }}>ID: {id}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate(`/app/customers/edit/${id}`)} sx={{ borderColor: 'white', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  Editar
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
                  Eliminar
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Grid de Información */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
          <Box>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
              <CardHeader title="Datos de Contacto" sx={{ pb: 0 }} />
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ spaceY: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Email</Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{customer.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Teléfono</Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{customer.phone || 'No especificado'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Dirección</Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{customer.address || "No especificada"}</Typography>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>Estado de Deuda</Typography>
                    {(customer.debt || 0) > 0 ? (
                      <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 800 }}>${(customer.debt || 0).toLocaleString()}</Typography>
                    ) : (
                      <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 800 }}>¡Deuda saldada!</Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
              <CardHeader title="Información Adicional" sx={{ pb: 0 }} />
              <CardContent sx={{ pt: 2, textAlign: 'center' }}>
                <Typography variant="overline" sx={{ color: '#64748b' }}>Fecha de Registro</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                  {new Date(customer.createdAt).toLocaleDateString('es-ES')}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Registrar Pago */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mt: 4 }}>
          <CardHeader title="Registrar un Nuevo Pago" />
          <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
             <TextField
             fullWidth
             type="number"
             label="Monto del Pago"
             value={newPaymentAmount}
             onChange={(e) => setNewPaymentAmount(e.target.value)}
             slotProps={{
             input: {
             startAdornment: (
             <InputAdornment position="start">
            $
            </InputAdornment>
        ),
      },
      }}
       disabled={paymentLoading}
      />

     <Button
       variant="contained"
       onClick={handleAddPayment}
      disabled={paymentLoading || !newPaymentAmount}
       >
      {paymentLoading ? "Registrando..." : "Añadir Pago"}
     </Button>
      </Box>
          </CardContent>
        </Card>

        {/* Historial de Pagos */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mt: 4 }}>
          <CardHeader title="Historial de Pagos" />
          <CardContent>
            {!customer.payments || customer.payments.length === 0 ? (
              <Typography sx={{ color: '#94a3b8', fontStyle: 'italic', py: 2, textAlign: 'center' }}>No hay pagos registrados para este cliente.</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {customer.payments.map((p: any, i: number) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {p.type === 'initial' ? '💰 Pago Inicial' : '💵 Pago Recibido'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {new Date(p.date).toLocaleString('es-ES')}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          mt: 0.5,
                        }}
                      >
                        Saldo restante: ${p.remainingDebt?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '1.2rem' }}>+ ${p.amount?.toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={() => navigate("/app/customers")}
          sx={{ mt: 4, color: '#64748b', '&:hover': { color: 'text.primary' } }}
        >
          ← Volver al listado
        </Button>
      </Container>
    </Box>
  );
};

export default CustomerDetail;