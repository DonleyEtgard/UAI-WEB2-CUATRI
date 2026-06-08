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
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import API from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [form, setForm] = useState({
  name: "",
  description: "",
  price: 0,
  cost: 0,
  stock: 0,
  category: "general",
  images: [] as string[],
  isActive: true,
});

  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        setFetching(true);
        const res = await API.get(`/products/${id}`);
        const p = res.data.data?.product || res.data;
        setForm({ 
          ...p, 
          images: p.images || [] 
        });
      } catch (err) {
        console.error(err);
        alert("Error cargando producto");
      } finally {
        setFetching(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const base64Promises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const newImagesBase64 = await Promise.all(base64Promises);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImagesBase64],
      }));
    } catch (error) {
      console.error("Error al procesar imágenes:", error);
      alert("Error al procesar las imágenes");
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...form };
      if (isEdit) {
        await API.patch(`/products/${id}`, payload);
      } else {
        await API.post("/products", payload);
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

      {/* GALLERY PREVIEW */}
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Galería de Imágenes" 
          subheader={`${form.images.length} imágenes seleccionadas`}
          action={
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCamera />}
            >
              Añadir Imágenes
              <input
                hidden
                type="file"
                multiple
                accept="image/*"
                onChange={handleImage}
              />
            </Button>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              minHeight: form.images.length > 0 ? "auto" : 100,
              alignItems: "center",
              justifyContent: form.images.length > 0 ? "flex-start" : "center",
              border: "2px dashed #e2e8f0",
              borderRadius: 2,
              p: 2
            }}
          >
            {form.images.length === 0 && (
              <Typography color="text.secondary">No hay imágenes seleccionadas</Typography>
            )}
            {form.images.map((img, index) => (
              <Box key={index} sx={{ position: "relative", width: 120, height: 120 }}>
                <img
                  src={img}
                  alt={`preview-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeImage(index)}
                  sx={{ position: "absolute", top: -10, right: -10, bgcolor: "white", "&:hover": { bgcolor: "#f1f1f1" } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

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

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Costo"
                  value={form.cost}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cost: Number(e.target.value),
                    })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
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

              <Grid size={{ xs: 12, md: 6 }}>
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