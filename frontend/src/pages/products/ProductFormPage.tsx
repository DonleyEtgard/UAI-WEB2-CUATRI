import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Container,
  Typography,
  Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import API from "../../services/api";
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
  <Box
    sx={{
      minHeight: "100vh",
      py: { xs: 2, md: 4 },
      px: { xs: 2, md: 0 },
    }}
  >
    <Container maxWidth="lg">

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
          pb: 3,
          borderBottom: "2px solid #e0e7ff",
        }}
      >
        <Box>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 900,
              margin: 0,
              color: "#fff",
            }}
          >
            {isEdit ? (
              <>
                Editar <span style={{ color: "#6366f1" }}>Producto</span>
              </>
            ) : (
              <>
                Nuevo <span style={{ color: "#6366f1" }}>Producto</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              marginTop: "0.5rem",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Gestión de catálogo e inventario
          </p>
        </Box>
      </Box>

      {/* KPI PREVIEW */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                Precio Actual
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: 'primary.main' }}
              >
                ${form.price || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                Stock
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900 }}
              >
                {form.stock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                Estado
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={
                    form.isActive
                      ? "Activo"
                      : "Inactivo"
                  }
                  color={
                    form.isActive
                      ? "success"
                      : "default"
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>

        {/* INFORMACIÓN GENERAL */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="Información General"
            subheader="Datos básicos del producto"
          />

          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="SKU"
                  value={form.sku}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sku: e.target.value,
                    })
                  }
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* INFORMACIÓN COMERCIAL */}
        <Card sx={{ mb: 4 }}>
          <CardHeader
            title="Información Comercial"
            subheader="Precios, stock y categoría"
          />

          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: Number(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>
                    Categoría
                  </InputLabel>

                  <Select
                    value={form.category}
                    label="Categoría"
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category:
                          e.target.value,
                      })
                    }
                  >
                    <MenuItem value="general">
                      General
                    </MenuItem>

                    <MenuItem value="electronics">
                      Electrónica
                    </MenuItem>

                    <MenuItem value="office">
                      Oficina
                    </MenuItem>

                    <MenuItem value="services">
                      Servicios
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={() =>
              navigate("/app/products")
            }
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : isEdit
              ? "Actualizar Producto"
              : "Crear Producto"}
          </Button>
        </Box>

      </form>
    </Container>
  </Box>
);
};
export default ProductFormPage;