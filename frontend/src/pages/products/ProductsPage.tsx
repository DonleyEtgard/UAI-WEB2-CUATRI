import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import DataGridWrapper from "../../components/common/DataGridWrapper";
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
import Inventory2Icon from "@mui/icons-material/Inventory2";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

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
    if (!confirm("¿Desea eliminar este producto?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto");
    } finally {
      setDeletingId(null);
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
            Gestión de{" "}
            <Box
              component="span"
              sx={{ color: "#6366f1" }}
            >
              Productos
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
            Administración de inventario
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
          Nuevo Producto
        </Button>
      </Box>

      {/* KPIs */}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          {
            label: "Productos",
            value: totalProducts,
          },
          {
            label: "Stock Bajo",
            value: lowStock,
          },
          {
            label: "Activos",
            value: activeProducts,
          },
          {
            label: "Valor Inventario",
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
          title="Inventario"
          subheader="Listado completo de productos"
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
              title="No hay productos"
              description="Crea tu primer producto para comenzar a vender."
              actionLabel="Crear producto"
              onAction={() =>
                navigate(
                  "/app/products/new"
                )
              }
            />
          ) : (
            <DataGridWrapper
              rows={products.map((p) => ({
                ...p,
                id: p._id,
              }))}

              columns={[
                {
                  field: "name",
                  headerName: "Producto",
                  flex: 1.5,

                  renderCell: (
                    params: any
                  ) => (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          bgcolor:
                            "action.hover",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        <Inventory2Icon />
                      </Box>

                      <Box>
                        <Typography
                          sx={{ fontWeight: 700 }}
                        >
                          {
                            params.row
                              .name
                          }
                        </Typography>

                      </Box>
                    </Box>
                  ),
                },

                {
                  field: "category",
                  headerName:
                    "Categoría",
                  width: 160,

                  renderCell: (
                    params: any
                  ) => (
                    <Chip
                      size="small"
                      variant="outlined"
                      label={
                        params.value
                      }
                    />
                  ),
                },

                {
                  field: "price",
                  headerName:
                    "Precio",
                  width: 130,

                  renderCell: (
                    params: any
                  ) => (
                    <Typography
                      sx={{ fontWeight: 700 }}
                      color="primary"
                    >
                      $
                      {Number(
                        params.row
                          .price
                      ).toLocaleString()}
                    </Typography>
                  ),
                },

                {
                  field: "stock",
                  headerName:
                    "Stock",
                  width: 140,

                  renderCell: (
                    params: any
                  ) => {
                    const stock =
                      params.value;

                    const color =
                      stock < 5
                        ? "error"
                        : stock < 15
                        ? "warning"
                        : "success";

                    return (
                      <Chip
                        size="small"
                        color={
                          color as any
                        }
                        label={`${stock} unidades`}
                      />
                    );
                  },
                },

                {
                  field: "isActive",
                  headerName:
                    "Estado",
                  width: 120,

                  renderCell: (
                    params: any
                  ) => (
                    <Chip
                      size="small"
                      label={
                        params.value
                          ? "Activo"
                          : "Oculto"
                      }
                      color={
                        params.value
                          ? "success"
                          : "default"
                      }
                    />
                  ),
                },

                {
                  field: "actions",
                  headerName:
                    "Acciones",
                  width: 180,
                  sortable: false,

                  renderCell: (
                    params: any
                  ) => (
                    <Box
                      sx={{
                        display:
                          "flex",
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            `/app/products/edit/${params.row._id}`
                          )
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        disabled={
                          deletingId ===
                          params.row
                            ._id
                        }
                        onClick={() =>
                          handleDelete(
                            params.row
                              ._id
                          )
                        }
                      >
                        {deletingId ===
                        params.row
                          ._id
                          ? "..."
                          : "Eliminar"}
                      </Button>
                    </Box>
                  ),
                },
              ]}

              pageSize={10}

              onRowClick={(
                params: any
              ) =>
                navigate(
                  `/app/products/edit/${params.row._id}`
                )
              }
            />
          )}

        </CardContent>
      </Card>

    </Container>
  </Box>
);
};

export default ProductsPage;