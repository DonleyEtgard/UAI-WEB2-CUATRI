/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, TextField, Button, Grid, FormControlLabel, Switch } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import API from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const CustomerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    const loadCustomer = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/customers/${id}`);
        const c = res.data.data.customer;
        setForm({ ...c });
      } catch (err) {
        console.error(err);
        alert("Error cargando datos del cliente");
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
        await API.patch(`/customers/${id}`, form);
      } else {
        await API.post("/customers", form);
      }
      navigate("/app/customers");
    } catch (err) {
      console.error(err);
      alert("Error al guardar el cliente");
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
          title={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
          subheader="Completa los datos de contacto y preferencias del cliente."
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
        />
        
        <CardContent sx={{ pt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Nombre y Apellido */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  placeholder="Ej. María"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  placeholder="Ej. González"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Email y Teléfono */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="email"
                  required
                  label="Email"
                  placeholder="contacto@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  placeholder="+54 11 ..."
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
                  label="Dirección / Notas"
                  placeholder="Calle, Ciudad, Provincia, Código Postal..."
                  value={form.address || ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={4}
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
                  label="Cliente Activo - Habilitar para nuevas transacciones"
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
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ textTransform: 'none', fontSize: 16, boxShadow: 2 }}
                >
                  {loading ? "Sincronizando..." : isEdit ? "Actualizar Cliente" : "Guardar Cliente"}
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