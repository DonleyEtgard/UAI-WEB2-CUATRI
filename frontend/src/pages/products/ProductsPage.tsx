import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";


export type Product = {
  _id: string;
  name: string;
  user: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  category?: string;
  images?: string[];
  isActive: boolean;
};

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loadProducts = async () => {
  try {
    setLoading(true);

    const res = await API.get("/products");

    setProducts(
      Array.isArray(res.data)
        ? res.data
        : []
    );
  } catch (err) {
    console.error(err);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t("products.list.confirmDelete"))) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert(t("products.list.deleteError"));
    }
  };

  // KPIs
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock < 5).length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const inventoryValue = products.reduce(
  (acc, p) => acc + (p.cost * p.stock),
  0
);


return (
  <Box
    sx={{
      minHeight: "100vh",
      py: { xs: 2, md: 4 },
      px: { xs: 2, md: 0 },
    }}
  >
    <Container maxWidth="xl">

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
          <Typography
            variant="h3"
            sx={{ fontWeight: 900, color: "white" }}
          >
            {t("products.list.title")}{" "}
            <Box
              component="span"
              sx={{ color: "#6366f1" }}
            >
              {t("products.list.highlight")}
            </Box>
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {t("products.list.subtitle")}
          </Typography>
        </Box>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() =>
            navigate("/app/products/new")
          }
          sx={{
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {t("products.list.newProduct")}
        </Button>
      </Box>

      {/* KPIs */}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          {
            label: t("products.list.totalProducts"),
            value: totalProducts,
          },
          {
            label: t("products.list.lowStock"),
            value: lowStock,
          },
          {
            label: t("products.list.activeProducts"),
            value: activeProducts,
          },
          {
            label: t("products.list.inventoryValue"),
            value: `$${inventoryValue.toLocaleString()}`,
          },
        ].map((item, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 2,
              }}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900 }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TABLA */}

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 2,
        }}
      >
        <CardHeader
          title={t("products.list.inventory")}
          subheader={t("products.list.inventoryDescription")}
          action={
            <IconButton
              onClick={loadProducts}
            >
              <RefreshIcon />
            </IconButton>
          }
        />

        <CardContent>

          {loading ? (
            <SkeletonLoader
              count={6}
              height={48}
            />
          ) : products.length === 0 ? (
            <EmptyState
              title={t("products.list.noProducts")}
              description={t("products.list.noProductsDescription")}
              actionLabel={t("products.list.createProduct")}
              onAction={() =>
                navigate(
                  "/app/products/new"
                )
              }
            />
          ) : (
           <Grid container spacing={3}>
  {products.map((p) => (
    <Grid
      key={p._id}
      size={{
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3,
      }}
    >
      <Card
        sx={{
          cursor: "pointer",
          transition: ".2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent>

          <Box
            sx={{
              height: 180,
              mb: 2,
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "#f3f4f6",
            }}
          >
            <img
              src={
                p.images?.[0]
                  ? p.images[0].startsWith("http")
                    ? p.images[0]
                    : `http://localhost:3000${p.images[0]}` // This seems to be a local development URL, left as is.
                  : `https://placehold.co/400x300?text=${t("products.list.placeholderImage")}`
              }
              alt={p.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          <Typography sx={{ fontWeight: 860 }}>
            {p.name}
          </Typography>

          <Typography sx={{ fontweight: 750, fontWeight: 700, color: "black" }}
            variant="body2"
            color="text.secondary"
          >
            {p.description}
          </Typography>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            {p.category}
          </Typography>

          <Chip
            size="small"
            color={
              p.stock < 5
                ? "error"
                : p.stock < 15
                ? "warning"
                : "success"
            }
            label={`${t("products.list.stock")} ${p.stock}`}
            sx={{ mt: 1 }}
          />

          <Typography
            variant="h5"
            color="primary"
            sx={{
              mt: 2,
              fontWeight: 900,
            }}
          >
            ${p.price.toLocaleString()}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={() =>
                navigate(`/app/products/edit/${p._id}`)
              }
            >
              {t("products.list.edit")}
            </Button>

            <Button
              fullWidth
              color="error"
              variant="outlined"
              onClick={() =>
                handleDelete(p._id)
              }
            >
              {t("products.list.delete")}
            </Button>
          </Box>

        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
          )}
          </CardContent>
          </Card>
          </Container>
          </Box>

          )}
export default ProductsPage;