import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import API from "../../services/api";
import UiCard from "../../components/common/UiCard";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    description: "",
    price: 0,
    stock: 0,
    category: "general",
    isActive: true,
  });

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/products/${id}`);
        const p = res.data.data.product;
        setForm({ ...p });
      } catch (err) {
        console.error(err);
        alert("Error cargando producto");
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await API.patch(`/products/${id}`, form);
      } else {
        await API.post("/products", form);
      }
      navigate("/app/products");
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 4 } }}>
        <SkeletonLoader count={5} height={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 4 }, animation: 'fadeIn 0.5s ease-in-out' }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardHeader 
          title={isEdit ? "Editar Producto" : "Nuevo Producto"}
          subheader="Ingresa los detalles técnicos y comerciales del artículo."
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
        />
        
        <CardContent sx={{ pt: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Nombre y SKU */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre del Producto"
                  placeholder="Ej. MacBook Pro M3"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="SKU / Código"
                  placeholder="MBP-M3-2024"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  variant="outlined"
                  size="medium"
                  inputProps={{ style: { fontFamily: 'monospace' } }}
                />
              </Grid>

              {/* Precio, Stock, Categoría */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio (USD)"
                  inputProps={{ step: "0.01" }}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock Inicial"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    label="Categoría"
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="electronics">Electrónica</MenuItem>
                    <MenuItem value="office">Oficina</MenuItem>
                    <MenuItem value="services">Servicios</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Descripción */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción"
                  placeholder="Detalles adicionales del producto..."
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={4}
                />
              </Grid>

              {/* Botones */}
              <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<CancelIcon />}
                  onClick={() => navigate("/app/products")}
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
                  {loading ? "Guardando..." : isEdit ? "Actualizar Producto" : "Crear Producto"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductFormPage;