import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createStockMovement } from "../../services/stock.service.ts";
import { Container, Box, Typography, Card, CardContent, TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

type FormState = {
  product: string;
  type: "in" | "out";
  quantity: number;
  user: string;
  reason: string;
  sale?: string;
};

export default function StockMovementForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>({
    product: "",
    type: "in",
    quantity: 1,
    user: user?._id || "",
    reason: "adjustment",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "quantity"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createStockMovement({
        ...form,
        user: user?._id || form.user // Aseguramos el ID del usuario actual
      });

      alert("Movimiento creado correctamente");

      setForm((prev) => ({
        ...prev,
        product: "",
        type: "in",
        quantity: 1,
        reason: "adjustment",
      }));
    } catch (error) {
      console.error(error);
      alert("Error al crear movimiento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f1115', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#e4e2e4', mb: 1 }}>
            📦 Registrar Movimiento
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Actualiza el inventario registrando entradas o salidas manuales.
          </Typography>
        </Box>

        <Card sx={{ bgcolor: '#111827', border: '1px solid #2b2d31', borderRadius: 4, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="overline" sx={{ color: '#9ca3af', fontWeight: 700, mb: 1, display: 'block' }}>ID del Producto</Typography>
                  <TextField fullWidth name="product" placeholder="Escriba o pegue el ID del producto" value={form.product} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: 'white', bgcolor: '#0f1115', borderRadius: 3 } }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#9ca3af', fontWeight: 700, mb: 1, display: 'block' }}>Tipo de Operación</Typography>
                    <TextField select fullWidth name="type" value={form.type} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: 'white', bgcolor: '#0f1115', borderRadius: 3 } }}>
                      <MenuItem value="in">Entrada (+)</MenuItem>
                      <MenuItem value="out">Salida (-)</MenuItem>
                    </TextField>
                  </Box>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#9ca3af', fontWeight: 700, mb: 1, display: 'block' }}>Cantidad</Typography>
                    <TextField fullWidth name="quantity" type="number" value={form.quantity} onChange={handleChange} slotProps={{ htmlInput: { min: 1 } }} sx={{ '& .MuiOutlinedInput-root': { color: 'white', bgcolor: '#0f1115', borderRadius: 3 } }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="overline" sx={{ color: '#9ca3af', fontWeight: 700, mb: 1, display: 'block' }}>Motivo</Typography>
                  <TextField select fullWidth name="reason" value={form.reason} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { color: 'white', bgcolor: '#0f1115', borderRadius: 3 } }}>
                    <MenuItem value="adjustment">Ajuste Manual</MenuItem>
                    <MenuItem value="sale">Venta</MenuItem>
                    <MenuItem value="purchase">Compra / Abastecimiento</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ py: 2, borderRadius: 3, bgcolor: '#6366f1', '&:hover': { bgcolor: '#4f46e5' }, fontWeight: 700 }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar Movimiento"}
                  </Button>
                  <Button fullWidth variant="outlined" onClick={() => navigate("/app/stock")} sx={{ py: 2, borderRadius: 3, borderColor: '#2b2d31', color: '#9ca3af', '&:hover': { borderColor: '#e4e2e4', color: 'white' } }}>
                    Cancelar
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}