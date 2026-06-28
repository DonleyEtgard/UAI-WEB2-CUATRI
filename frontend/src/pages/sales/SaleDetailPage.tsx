import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, Container, Grid, Button, Chip, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import API from "../../services/api";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import ReceiptIcon from "@mui/icons-material/Receipt";


/**
 * Define valid currency literals. 
 * We include "$ ARG" to resolve the assignment error, 
 * though using standard codes like 'ARS' is preferred.
 */
export type Currency = 'HTG' | '$ ARG';
export type SaleStatus = 'paid' | 'pending' | 'cancelled' | string;

export interface SaleItem {
  product?: string;
  productName?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  customerId: string;
  total: number;
  amountPaid: number;
  status: SaleStatus;
  currency: Currency;
  createdAt: string;
  items: SaleItem[];
}

const SaleDetailPage = () => {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

   const load = async () => {
       try {
    const res = await API.get(`/sales/${id}`);

     console.log("SALE DETAIL:", res.data);

     setSale(res.data);
     } catch (err) {
      console.error("Error loading sale:", err);
      } finally {
      setLoading(false);
     }
    };

    load();
  }, [id]);
     

  const handleDelete = async () => {
    if (!id || deleting) return;
    const ok = confirm("¿Eliminar venta?");
    if (!ok) return;
    try {
      setDeleting(true);
      await API.delete(`/sales/${id}`);
      navigate("/app/sales");
    } finally {
      setDeleting(false);
    }
  };

  const metrics = useMemo(() => {
    if (!sale) return null;
   const subtotal = sale.items.reduce( (acc, i) => acc + i.subtotal, 0 );
    const avgItem = subtotal / sale.items.length || 0;
    const change = sale.amountPaid - sale.total;
    return { subtotal, avgItem, change, profitEstimate: subtotal * 0.25 };
  }, [sale]);


  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <Box sx={{ maxWidth: 600, width: '100%' }}>
        <SkeletonLoader count={5} height={40} />
      </Box>
    </Box>
  );

  if (!sale || !metrics) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10, minHeight: '100vh' }}>
      <EmptyState title="Venta no encontrada" description="Esta venta no existe o fue eliminada." />
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        {/* Header Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>Venta #{sale._id.slice(-8)}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>{new Date(sale.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label={sale.status} color="primary" variant="filled" />
                <Chip label={sale.currency} variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Sale Summary */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardHeader title="Información de la Venta" />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', mb: 0.5 }}>Total</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>${sale.total.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', mb: 0.5 }}>Pagado</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>${sale.amountPaid.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', mb: 0.5 }}>Vuelto</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: metrics.change > 0 ? '#f59e0b' : '#64748b' }}>${Math.abs(metrics.change).toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', mb: 0.5 }}>Cliente</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{sale.customerId}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* KPI Cards */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Subtotal</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>${metrics.subtotal.toFixed(2)}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Promedio/Item</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>${metrics.avgItem.toFixed(2)}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Est. Ganancia</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: '#10b981' }}>${metrics.profitEstimate.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Items Table */}
        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardHeader title="Productos en esta Venta" subheader={`${sale.items.length} artículos`} />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell><strong>Producto</strong></TableCell>
                  <TableCell align="center"><strong>Cantidad</strong></TableCell>
                  <TableCell align="right"><strong>Precio Unit.</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
             <TableBody>
  {sale.items?.map((item, idx) => (
    <TableRow
      key={idx}
      sx={{ '&:hover': { bgcolor: '#f8fafc' } }}
    >
      <TableCell>
        {item.productName || item.product || "Producto"}
      </TableCell>

      <TableCell align="center">
        {item.quantity}
      </TableCell>

      <TableCell align="right">
        ${(item.price ?? 0).toFixed(2)}
      </TableCell>

      <TableCell
        align="right"
        sx={{ fontWeight: 700 }}
      >
        ${(item.subtotal ?? 0).toFixed(2)}
      </TableCell>
    </TableRow>
    ))}
    </TableBody>
            </Table>
          </TableContainer>
        </Card>

       <Box
  sx={{
    display: "flex",
    gap: 2,
    flexWrap: "wrap"
  }}
>
  <Button
    variant="outlined"
    startIcon={<ArrowBackIcon />}
    onClick={() => navigate("/app/sales")}
  >
    Volver
  </Button>

<Button
  variant="contained"
  color="info"
  startIcon={<ReceiptIcon />}
  onClick={() => navigate(`/app/sales/ticket/${sale._id}`)}
>
  Ver Ticket
</Button>

  <Button
    variant="contained"
    color="error"
    disabled={deleting}
    startIcon={<DeleteIcon />}
    onClick={handleDelete}
  >
     {deleting ? <CircularProgress size={20} /> : "Eliminar"}
    </Button>
   </Box>
      </Container>
    </Box>
  );
};

export default SaleDetailPage;