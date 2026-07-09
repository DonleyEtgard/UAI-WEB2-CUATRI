import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Box, Typography, Button, Skeleton, Paper, Chip, Divider, Pagination, ToggleButtonGroup, ToggleButton } from "@mui/material";

interface Movement {
  _id: string;
  productId: { name: string; sku: string };
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  user: { name: string; lastName: string };
  createdAt: string;
}

const StockMovement = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const navigate = useNavigate();

  const loadMovements = async () => {
    try {
      setLoading(true);
      const res = await API.get("/stock/movements");
      setMovements(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error loading movements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const filteredMovements = movements.filter((m) => 
    filter === "all" ? true : m.type === filter
  );

  const getTypePresentation = (type: string) => {
    switch (type) {
      case "in": return { color: "success.main", icon: "↑" };
      case "out": return { color: "error.main", icon: "↓" };
      default: return { color: "warning.main", icon: "±" };
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Movimientos de Stock
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Auditoría de Inventario
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/app/stock/new")}
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          Registrar Ajuste
        </Button>
      </Box>

      {/* Filters Segmented Control */}
      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, newValue) => { if (newValue) setFilter(newValue); }}
          aria-label="Filtros de movimiento"
        >
          <ToggleButton value="all">Todos</ToggleButton>
          <ToggleButton value="in">Entradas</ToggleButton>
          <ToggleButton value="out">Salidas</ToggleButton>
          <ToggleButton value="adjustment">Ajustes</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {loading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} variant="rectangular" height={160} sx={{ borderRadius: 2 }} />)
        ) : filteredMovements.length === 0 ? (
          <Paper sx={{ textAlign: 'center', p: 8, bgcolor: 'background.default' }}>
            <Typography color="text.secondary">No se encontraron movimientos con estos filtros.</Typography>
          </Paper>
        ) : (
          filteredMovements.map((m) => {
            const presentation = getTypePresentation(m.type);
            return (
              <Paper key={m._id} elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 50, height: 50, borderRadius: 2, bgcolor: `${presentation.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: presentation.color }}>
                      {presentation.icon}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, display: { xs: 'block', sm: 'none' } }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{m.productId?.name || "Producto desconocido"}</Typography>
                    <Chip label={m.productId?.sku} size="small" variant="outlined" />
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{m.productId?.name || "Producto desconocido"}</Typography>
                    <Chip label={m.productId?.sku} size="small" variant="outlined" />
                  </Box>
                  <Typography sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 1 }}>
                    "{m.reason || "Sin descripción proporcionada"}"
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, minWidth: '120px' }}>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 'bold', color: presentation.color }}>
                    {m.type === "out" ? "-" : "+"}{Math.abs(m.quantity)}
                  </Typography>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'text.secondary' }}>
                    Unidades
                  </Typography>
                </Box>

                <Divider sx={{ my: { xs: 2, sm: 0 } }} orientation="vertical" flexItem />

                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, minWidth: '180px' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Por: <Typography component="span" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{m.user?.name} {m.user?.lastName}</Typography>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {new Date(m.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </Typography>
                </Box>
              </Paper>
            );
          })
        )}
      </Box>

      {/* Pagination Placeholder */}
      <Box sx={{ pt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination count={1} disabled />
      </Box>
    </Box>
  );
};

export default StockMovement;