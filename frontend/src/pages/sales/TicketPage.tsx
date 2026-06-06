import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Divider, Container, CircularProgress } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import { fetchTicket, type TicketData, type SaleItem } from "./api";
import API from "../../services/api";

const TicketPage = () => {
  const { id } = useParams();

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadTicket = async () => {
    try {
      setLoading(true);
      if (!id) return;
      const data = await fetchTicket(id);
      setTicket(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = async () => {
    try {
      if (!ticket?.sale) return;
      const phone = ticket.sale.customer?.phone;
      if (!phone) {
        alert("El cliente no tiene teléfono");
        return;
      }
      const res = await API.post("/sales/ticket/send-whatsapp", {
        saleId: ticket.sale._id,
        phone,
      });
      window.open(res.data.whatsappUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Error enviando WhatsApp");
    }
  };

  const sendTelegram = async () => {
    try {
      if (!ticket?.sale) return;
      const { sale } = ticket;
      const res = await API.post("/sales/ticket/send-telegram", {
        saleId: sale._id,
      });
      window.open(res.data.telegramUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Error enviando Telegram");
    }
  };

  useEffect(() => {
    if (id) loadTicket();
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress />
    </Box>
  );

  if (!ticket) return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography>No se encontró el ticket</Typography>
    </Box>
  );

  const { sale, items } = ticket;

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: 2, bgcolor: '#f8fafc' }}>
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: 'white' }}>
          <CardContent sx={{ textAlign: 'center', pt: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>🧾 Ticket de Venta</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace', display: 'block', fontSize: 11 }}>ID: {sale._id}</Typography>
          </CardContent>

          <Divider />

          {/* Customer & Seller Info */}
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'grid', gap: 2, fontSize: 14 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#64748b' }}>Cliente:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{sale.customer?.name || "Consumidor Final"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#64748b' }}>Vendedor:</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 12 }}>{sale.user?.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ color: '#64748b' }}>Fecha:</Typography>
                <Typography sx={{ fontWeight: 600 }}>{new Date(sale.createdAt).toLocaleString('es-ES')}</Typography>
              </Box>
            </Box>
          </CardContent>

          <Divider />

          {/* Items Table */}
          <CardContent sx={{ py: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {items.map((item: SaleItem) => (
                    <TableRow key={item._id} sx={{ borderBottom: 'none' }}>
                      <TableCell sx={{ p: 0.5, fontSize: 13 }}>
                        <Box>
                          <Typography variant="body2">{item.quantity} x {item.product?.name || item.productName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ p: 0.5, fontSize: 13, fontWeight: 700 }}>
                        ${item.subtotal}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>

          <Divider />

          {/* Total & Payment */}
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ display: 'grid', gap: 1.5, fontSize: 14 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <Typography sx={{ fontWeight: 700 }}>Total:</Typography>
                <Typography sx={{ fontWeight: 700, color: '#667eea', fontSize: 16 }}>${sale.total}</Typography>
              </Box>

              {sale.paymentMethod === "cash" && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: '#64748b' }}>Pagado:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>${sale.amountPaid}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontWeight: 600 }}>
                    <Typography sx={{ color: '#10b981' }}>Cambio:</Typography>
                    <Typography sx={{ color: '#10b981', fontWeight: 700 }}>${sale.change}</Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <Typography sx={{ color: '#64748b' }}>Método:</Typography>
                <Typography sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{sale.paymentMethod}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <Typography sx={{ color: '#64748b' }}>Estado:</Typography>
                <Typography sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{sale.status}</Typography>
              </Box>
            </Box>
          </CardContent>

          {sale.notes && (
            <>
              <Divider />
              <CardContent sx={{ py: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Nota:</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{sale.notes}</Typography>
              </CardContent>
            </>
          )}

          <Divider />

          {/* Actions */}
          <CardContent sx={{ display: 'grid', gap: 1.5 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              sx={{ textTransform: 'none' }}
            >
              Imprimir
            </Button>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#25d366', '&:hover': { bgcolor: '#1ea755' } }}
                startIcon={<WhatsAppIcon />}
                onClick={sendWhatsApp}
                size="small"
              >
                WhatsApp
              </Button>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#0088cc', '&:hover': { bgcolor: '#0070a3' } }}
                startIcon={<TelegramIcon />}
                onClick={sendTelegram}
                size="small"
              >
                Telegram
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TicketPage;