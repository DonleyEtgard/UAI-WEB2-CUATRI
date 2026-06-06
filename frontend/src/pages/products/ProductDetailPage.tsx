import { useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct, useDeleteProduct } from "@/features/products";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading, reload } = useProduct(id || "");
  const { handleDelete: apiDelete } = useDeleteProduct();

  useEffect(() => {
    if (id) reload();
  }, [id, reload]);

  const handleDelete = async () => {
    if (!id) return;

    const ok = confirm("¿Eliminar producto?");
    if (!ok) return;

    try {
      await apiDelete(id);
      navigate("/app/products");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <SkeletonLoader count={4} height={28} />;
  if (!product) return <div className="p-6"><EmptyState title="Producto no encontrado" description="Este producto no existe o fue eliminado." /></div>;

  return (
  <Box sx={{ minHeight: "100vh", py: { xs: 2, md: 4 } }}>
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
            {product.name}
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
            Información completa del producto
          </p>
        </Box>

        <Chip
          label={product.isActive ? "Activo" : "Oculto"}
          color={product.isActive ? "success" : "default"}
        />
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                Precio de Venta
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: 'primary.main' }}
              >
                ${product.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                Costo
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900 }}
              >
                ${product.cost || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="overline">
                Stock Disponible
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: product.stock > 0 ? "success.main" : "error.main" }}
              >
                {product.stock}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* DETALLE */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Información General"
          subheader="Datos principales del producto"
        />

        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline">
                Categoría
              </Typography>

              <Typography variant="h6">
                {product.category?.name ||
                  "Sin categoría"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline">
                Estado
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Chip
                  label={
                    product.isActive
                      ? "Activo"
                      : "Oculto"
                  }
                  color={
                    product.isActive
                      ? "success"
                      : "default"
                  }
                />
              </Box>
            </Grid>

            <Grid size={12}>
              <Typography variant="overline">
                Descripción
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                {product.description ||
                  "Sin descripción disponible."}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ACTIONS */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="outlined"
          onClick={() =>
            navigate("/app/products")
          }
        >
          Volver
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              `/app/products/edit/${id}`
            )
          }
        >
          Editar
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
        >
          Eliminar
        </Button>
      </Box>

    </Container>
  </Box>
);
};
export default ProductDetailPage;