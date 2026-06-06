import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, Card, CardContent, Chip, Button, Typography, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import API from "../../services/api";
import EmptyState from "../../components/common/EmptyState";

interface Product {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: { name: string } | string;
}

const CriticalStockPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCriticalStock = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      const allProducts = Array.isArray(res.data?.data?.products) ? res.data.data.products : [];
      const critical = allProducts.filter((p: Product) => p.stock <= 10);
      setProducts(critical.sort((a: Product, b: Product) => a.stock - b.stock));
    } catch (err) {
      console.error("Error loading critical stock:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCriticalStock();
  }, []);

  const getAlertConfig = (stock: number) => {
    if (stock === 0) {
      return { label: "Agotado", color: "error" as const, icon: ErrorIcon, severity: "high" };
    }
    if (stock <= 5) {
      return { label: "Crítico", color: "warning" as const, icon: WarningIcon, severity: "critical" };
    }
    return { label: "Bajo", color: "info" as const, icon: CheckCircleIcon, severity: "low" };
  };

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, pb: 3, borderBottom: '2px solid #e0e7ff' }}>
          <Box>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0 }}>Alertas de Stock</h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 600 }}>Monitoreo de inventario crítico</p>
          </Box>
          <Button 
            startIcon={<RefreshIcon />}
            onClick={loadCriticalStock}
            disabled={loading}
            variant="outlined"
            sx={{ fontSize: 14 }}
          >
            Actualizar
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <EmptyState 
            title="Inventario Saludable" 
            description="No hay productos con stock crítico en este momento."
          />
        ) : (
          <Grid container spacing={3}>
            {products.map((p) => {
              const config = getAlertConfig(p.stock);
              return (
                <Grid item xs={12} sm={6} md={4} key={p._id}>
                  <Card sx={{ borderRadius: 3, boxShadow: 2, transition: 'all 0.3s ease', '&:hover': { boxShadow: 4, transform: 'translateY(-4px)' } }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Chip label={config.label} color={config.color} size="small" icon={<config.icon />} />
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#64748b', fontSize: 11 }}>SKU: {p.sku}</Typography>
                      </Box>
                      
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{p.name}</Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e0e7ff', pt: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', mb: 0.5 }}>STOCK</Typography>
                          <Typography variant="h4" sx={{ fontWeight: 900, color: config.color === 'error' ? '#ef4444' : config.color === 'warning' ? '#f59e0b' : '#06b6d4' }}>
                            {p.stock}
                          </Typography>
                        </Box>
                        <Button 
                          size="small"
                          variant="contained" 
                          startIcon={<AddIcon />}
                          onClick={() => navigate("/app/stock/new")}
                          sx={{ textTransform: 'none', fontSize: 12, fontWeight: 700 }}
                        >
                          Reponer
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CriticalStockPage;