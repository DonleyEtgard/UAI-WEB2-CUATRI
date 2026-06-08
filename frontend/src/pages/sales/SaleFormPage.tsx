import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, Container, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Button, Table, TableBody, TableCell, TableContainer, TableRow, Chip, Typography, CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import API from "../../services/api";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

const SaleFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, custRes] = await Promise.all([
          API.get("/products"),
          API.get("/customers"),
        ]);
        const prods = prodRes.data?.data?.products || prodRes.data?.products || prodRes.data || [];
        const custs = custRes.data?.data?.customers || custRes.data?.customers || custRes.data || [];
        setProducts(prods);
        setCustomers(custs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const addToCart = (product: any) => {
    const exists = cart.find(item => item.productId === product._id);
    if (exists) {
      setCart(cart.map(item => 
        item.productId === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.productId !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || cart.length === 0) return alert("Completa los datos");
    
    try {
      setLoading(true);
     await API.post("/sales", {
      customer: selectedCustomerId,
      paymentMethod: "cash",
      items: cart.map(i => ({
       product: i.productId,
       quantity: i.quantity
      })),
       amountPaid: total,
       notes: ""
    });
      navigate("/app/sales");
    } catch (err) {
      alert("Error al procesar la venta");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.isActive
  );

  return (
    <Box sx={{ minHeight: '100vh', py: { xs: 2, md: 4 }, px: { xs: 2, md: 0 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left: Product Selection */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardHeader 
                title="Nueva Transacción" 
                subheader="Selecciona cliente y agrega productos al carrito"
                sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
              />
              <CardContent sx={{ pt: 4 }}>
                {/* Customer Picker */}
                <Box sx={{ mb: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Cliente</InputLabel>
                    <Select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      label="Cliente"
                    >
                      <MenuItem value="">Selecciona un cliente...</MenuItem>
                      {customers.map(c => (
                        <MenuItem key={c._id} value={c._id}>{c.name} {c.lastName} ({c.email})</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Product Search */}
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    label="Buscar Productos"
                    placeholder="Escribe el nombre del producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                  />
                </Box>

                {/* Product Grid */}
                <Grid container spacing={2}>
                  {searchQuery && filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <Grid size={{ xs: 12, sm: 6 }} key={p._id}>
                        <Card 
                          sx={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              boxShadow: 3, 
                              transform: 'translateY(-4px)',
                              borderColor: '#667eea'
                            },
                            border: '1px solid #e0e7ff'
                          }}
                          onClick={() => addToCart(p)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>Stock: {p.stock}</Typography>
                              </Box>
                              <Chip label={`$${p.price}`} color="primary" variant="outlined" />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : searchQuery ? (
                    <Grid size={12}>
                      <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>No hay productos que coincidan</Typography>
                    </Grid>
                  ) : (
                    <Grid size={12}>
                      <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>Escribe para buscar productos</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Cart Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardHeader 
                title="Resumen de Venta"
                subheader={`${cart.length} artículos`}
                sx={{ pb: 2 }}
              />
              <CardContent sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px' }}>
                {cart.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4, color: '#94a3b8' }}>
                    <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.3, mb: 2 }} />
                    <Typography>El carrito está vacío</Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        {cart.map(item => (
                          <TableRow key={item.productId} sx={{ '&:hover': { bgcolor: '#f1f5f9' } }}>
                            <TableCell>
                              <Box>
                                <Typography variant="subtitle2">{item.name}</Typography>
                                <Typography variant="caption" sx={{ color: '#64748b' }}>
                                  {item.quantity} x ${item.price.toFixed(2)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                                <Button 
                                  size="small" 
                                  color="error"
                                  onClick={() => removeFromCart(item.productId)}
                                  startIcon={<DeleteIcon />}
                                  sx={{ fontSize: 10 }}
                                >
                                  Quitar
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>

              {/* Totals & Actions */}
              <Box sx={{ p: 2, borderTop: '1px solid #e0e7ff', bgcolor: '#f8fafc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>Subtotal:</Typography>
                  <Typography variant="body2">${total.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>Impuestos:</Typography>
                  <Typography variant="body2">$0.00</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, pt: 1, borderTop: '1px solid #e0e7ff' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Total:</Typography>
                  <Typography variant="h6" sx={{ color: '#6366f1', fontWeight: 900 }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Button 
                    fullWidth
                    variant="contained" 
                    color="primary"
                    size="large"
                    disabled={loading || cart.length === 0 || !selectedCustomerId}
                    onClick={handleSubmit}
                    startIcon={<SaveIcon />}
                    sx={{ textTransform: 'none', fontSize: 16, fontWeight: 700 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Finalizar Venta'}
                  </Button>
                  <Button 
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate("/app/sales")}
                    startIcon={<CancelIcon />}
                    sx={{ textTransform: 'none', fontSize: 14 }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SaleFormPage;