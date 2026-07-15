import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Box, Typography, Card, CardContent, CardHeader, Button, Avatar, Chip, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getCustomerById, addPayment, deleteCustomer } from "../../services/customers.service";
import type { Customer, Payment } from "../../services/customers.service";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const customerData = await getCustomerById(id);
        console.log("DEBUG: Customer Detail Loaded:", customerData);
        setCustomer(customerData);
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
      alert(t("customers.detail.invalidAmount"));
      return;
    }

    try {
      setPaymentLoading(true);
      const updatedCustomer = await addPayment(id, Number(newPaymentAmount));
      setCustomer(updatedCustomer); // Actualiza el estado del cliente con la respuesta
      setNewPaymentAmount(""); // Limpia el input
    } catch (err) {
      console.error("Error adding payment:", err);
      alert(t("customers.detail.paymentError"));
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || deleting) return;
    const ok = confirm(t("customers.detail.deleteConfirmation"));
    if (!ok) return;
    try {
      setDeleting(true);
      await deleteCustomer(id);
      navigate("/app/customers");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (!customer) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>{t("customers.detail.customerNotFound")}</Typography>
        <Button onClick={() => window.history.back()} sx={{ mt: 2 }}>{t("customers.detail.back")}</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header con Perfil - Responsive */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: 'space-between', gap: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'action.selected', fontSize: '2.5rem', fontWeight: 700 }}>
                {customer.name?.[0] || '?'}
              </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>{customer.name}</Typography>
                <Chip
                  label={customer.isActive ? t("customers.detail.active") : t("customers.detail.inactive")}
                  size="small"
                  color={customer.isActive ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>ID: {id}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
            <Button variant="outlined" onClick={() => navigate(`/app/customers/edit/${id}`)}>
                  {t("customers.detail.edit")}
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
                  {t("customers.detail.delete")}
                </Button>
              </Box>
            </Box>

        {/* Grid de Información - Responsive */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          <Box>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
              <CardHeader title={t("customers.detail.contactInformation")} sx={{ pb: 0 }} />
              <CardContent sx={{ pt: 2 }}>
                <Box sx={{ spaceY: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', 
                      fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>{t("customers.detail.email")}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{customer.email}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>{t("customers.detail.phone")}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{customer.phone || t("customers.detail.notSpecified")}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>{t("customers.detail.address")}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, mt: 0.5 }}>{customer.address || t("customers.detail.notSpecified")}</Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>{t("customers.detail.debtStatus")}</Typography>
                    {(customer.debt || 0) > 0 ? (
                      <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 800 }}>${(customer.debt || 0).toLocaleString()}</Typography>
                    ) : (
                      <Typography variant="h5" sx={{ color: '#10b981', fontWeight: 800 }}>{t("customers.detail.debtPaid")}</Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card sx={{ borderRadius: 3, boxShadow: 2, height: '100%' }}>
              <CardHeader title={t("customers.detail.additionalInformation")} sx={{ pb: 0 }} />
              <CardContent sx={{ pt: 2, textAlign: 'center' }}>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>{t("customers.detail.registrationDate")}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Registrar Pago */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mt: 4 }}>
          <CardHeader title={t("customers.detail.registerPayment")} />
          <CardContent>
          <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: "center" }}>
             <TextField
             fullWidth
             type="number"
             label={t("customers.detail.paymentAmount")}
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
      sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: '150px' }}
       >
      {paymentLoading ? t("customers.detail.processing") : t("customers.detail.addPayment")}
     </Button>
      </Box>
          </CardContent>
        </Card>

        {/* Historial de Pagos */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mt: 4 }}>
          <CardHeader title={t("customers.detail.paymentHistory")} />
          <CardContent>
            {!customer.payments || customer.payments.length === 0 ? (
              <Typography sx={{ color: 'text.secondary', fontStyle: 'italic', py: 2, textAlign: 'center' }}>{t("customers.detail.noPayments")}</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...customer.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((p: Payment, i: number) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {p.type === 'initial' ? t("customers.detail.initialPayment") : t("customers.detail.receivedPayment")}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(p.date).toLocaleString('es-ES')}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mt: 0.5,
                        }}
                      >
                        {t("customers.detail.remainingBalance")}: ${p.remainingDebt?.toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'success.main', fontWeight: 800, fontSize: '1.2rem' }}>+ ${p.amount?.toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        <Button 
          onClick={() => navigate("/app/customers")}
          sx={{ mt: 4, color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          {t("customers.detail.backToList")}
        </Button>
      </Container>
    </Box>
  );
};

export default CustomerDetail;