/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, CardHeader, TextField, Button, Grid, FormControlLabel, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { getCustomerById, createCustomer, updateCustomer } from "../../services/customers.service";

import type { Customer } from "../../services/customers.service";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const CustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const { t } = useTranslation();

  const [form, setForm] = useState<Partial<Customer> & { initialPayment?: number }>({
    name: '',
    email: '',
    phone: '',
    address: '',
    debt: 0,
    initialPayment: 0,
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    const loadCustomer = async () => {
      try {
        setFetching(true);
        const customerData = await getCustomerById(id);
        // Ajustado para coincidir con la respuesta directa del backend
        setForm(customerData);
      } catch (err) {
        console.error(err);
        alert(t("customers.form.loadingCustomerError"));
      } finally {
        setFetching(false);
      }
    };
    loadCustomer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    if (isEdit) {
      await updateCustomer(id!, form);
    } else {
      await createCustomer(form as Customer);
    }

    navigate("/app/customers");
  } catch (err) {
    console.error(err);
    alert(t("customers.form.saveCustomerError"));
  } finally {
    setLoading(false);
  }
};

  if (fetching) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 4 } }}>
        <SkeletonLoader count={6} height={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, sm: 4 }, animation: 'fadeIn 0.5s ease-in-out' }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardHeader 
          title={isEdit ? t("customers.form.editCustomer") : t("customers.form.newCustomer")}
          subheader={t("customers.form.subtitle")}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
        />
        
        <CardContent sx={{ pt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label={t("customers.form.name")}
                  placeholder={t("customers.form.namePlaceholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
               <TextField
  fullWidth
  type="number"
  label={t("customers.form.totalDebt")}
  placeholder="0"
  value={form.debt}
  onChange={(e) =>
    setForm({
      ...form,
      debt: Number(e.target.value),
    })
  }
/>
                   </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                label={t("customers.form.initialPayment")}
                 placeholder="0"
                value={form.initialPayment}
                disabled={isEdit}
               onChange={(e) =>
    setForm({
                  ...form,
      initialPayment: Number(e.target.value),
                })
               }
               helperText={
    isEdit ? t("customers.form.initialPaymentHelper") : ''
  }
                             />
                   </Grid>

              {/* Email y Teléfono */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="email"
                  required
                  label={t("customers.form.email")}
                  placeholder={t("customers.form.emailPlaceholder")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t("customers.form.phone")}
                  placeholder={t("customers.form.phonePlaceholder")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Dirección */}
              <Grid size={12}>
  <TextField
    fullWidth
    label={t("customers.form.address")}
    placeholder={t("customers.form.addressPlaceholder")}
    value={form.address || ""}
    onChange={(e) => setForm({ ...form, address: e.target.value })}
    variant="outlined"
  />
</Grid>

              {/* Estado Activo */}
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      size="medium"
                    />
                  }
                  label={t("customers.form.activeCustomer")}
                />
              </Grid>

              {/* Botones */}
              <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<CancelIcon />}
                  onClick={() => navigate("/app/customers")}
                  sx={{ textTransform: 'none', fontSize: 16 }}
                >
                  {t("customers.form.cancel")}
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ textTransform: 'none', fontSize: 16, boxShadow: 2 }}
                >
                  {loading ? t("customers.form.syncing") : isEdit ? t("customers.form.updateCustomer") : t("customers.form.saveCustomer")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerForm;