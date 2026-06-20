import { useEffect, useState } from "react";
import { useProducts } from "../products/hooks";
import { useCreateSale, useSales } from "./hooks";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import RefreshIcon from "@mui/icons-material/Refresh";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

type CartItem = {
  product: any;
  quantity: number;
};

const POSPage = () => {
  const { products, reload: loadProducts } = useProducts();
  const { handleCreate, loading } = useCreateSale();
  const { reload: reloadSales } = useSales();
  const { user } = useAuth();
const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [amountPaid, setAmountPaid] = useState(0);

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase().trim();

    const categoryStr = typeof p.category === "string" ? p.category : p.category?.name;

    return (
      p.name?.toLowerCase().includes(term) ||
      categoryStr?.toLowerCase().includes(term) ||
      p.description?.toLowerCase().includes(term) ||
      p.price?.toString().includes(term)
    );
  });
  

  // 🔄 cargar productos
  useEffect(() => {
    loadProducts();
  }, []);

  // 🛒 agregar producto
  const addToCart = (product: any) => {
    const existing = cart.find((i) => i.product._id === product._id);

      if (existing) {
      if (existing.quantity >= product.stock) {
      return;
        }

       setCart((prev) =>
         prev.map((i) =>
         i.product._id === product._id
         ? { ...i, quantity: i.quantity + 1 }
         : i
         )
         );
       } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  // ➖ disminuir cantidad
  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product._id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  

  // ❌ eliminar item
  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.product._id !== id));
  };

  // 💰 total
  const total = cart.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );
  
  const totalItems = cart.reduce(
  (acc, item) => acc + item.quantity,
  0
);
   
  const change = paymentMethod === "cash" ? amountPaid - total : 0;

  // 🧾 finalizar venta
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (paymentMethod === "cash" && amountPaid < total) {
      alert("Pago insuficiente");
      return;
    }

    try {
      await handleCreate({
        user: user?._id || "",
        paymentMethod,
        items: cart.map((i) => ({
          product: i.product._id,
          quantity: i.quantity
        })),
        amountPaid: paymentMethod === "cash" ? amountPaid : undefined
      });

      alert("Venta realizada correctamente ✅");

      // reset
      setCart([]);
      setAmountPaid(0);
      reloadSales();
      loadProducts();

    } catch (err: any) {
      alert(err.message);
    }
  };

 return (
  <Box
    sx={{
      minHeight: "100vh",
      py: 4,
      px: 2,
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
            Punto de{" "}
            <Box
              component="span"
              sx={{ color: "#6366f1" }}
            >
              Venta
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
            Gestión de ventas
          </Typography>
        </Box>

        <Button
          variant="outlined"
          sx={{ fontSize: 14, textTransform: 'none' , color: 'white' }}
          startIcon={<RefreshIcon />}
          onClick={loadProducts}
        >
          Actualizar
        </Button>
      </Box>

      {/* KPIs */}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          {
            label: "Productos",
            value: products.length,
          },
          {
            label: "Items",
            value: totalItems,
          },
          {
            label: "Total",
            value: `$${total.toLocaleString()}`,
          },
          {
            label: "Método",
            value:
              paymentMethod === "cash"
                ? "Efectivo"
                : paymentMethod === "card"
                ? "Tarjeta"
                : "Transferencia",
          },
        ].map((kpi, index) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
            key={index}
          >
            <Card>
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  {kpi.label}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900 }}
                >
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CONTENIDO */}
        <TextField
  fullWidth
  placeholder="Buscar por nombre, categoría o precio..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  sx={{
    mb: 3,

    "& .MuiOutlinedInput-root": {
      bgcolor: "white",
      borderRadius: 3,
      height: 56,

      "& fieldset": {
        borderColor: "#e2e8f0",
      },

      "&:hover fieldset": {
        borderColor: "#6366f1",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#6366f1",
      },
    },
  }}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="action" />
        </InputAdornment>
      ),
    },
  }}
/>
        {/* PRODUCTOS */}

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardHeader
              title="Productos"
              subheader="Seleccioná productos para vender"
            />

            <CardContent>
              <Grid container spacing={2}>
                {filteredProducts.map((p: any) => {

  console.log("Producto:", p.name);
  console.log("Imagen:", p.images?.[0]);
  console.log("Objeto completo:", p);

  return (
    <Grid
      key={p._id}
      size={{
        xs: 12,
        sm: 6,
        md: 4,
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
                      onClick={() => addToCart(p)}
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
      ? p.images[0]
      : "https://placehold.co/400x300?text=Producto"
  }
  alt={p.name}
  onLoad={() =>
    console.log("IMG OK:", p.images?.[0])
  }
  onError={() =>

    console.log("IMG ERROR:", p.images?.[0])
    
  }
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
     </Box>

  <Typography sx={{ fontWeight: 700 }}>
    {p.name}
  </Typography>
  
  <Typography
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
      p.stock > 0
        ? "success"
        : "error"
    }
    label={`Stock ${p.stock}`}
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

  <Button
    fullWidth
    variant="contained"
    sx={{ mt: 2 }}
  >
    Agregar
  </Button>

</CardContent>
                    </Card>
                  </Grid>
                );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* CARRITO */}

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              height: "100%",
            }}
          >
            <CardHeader
              avatar={<ShoppingCartIcon />}
              title="Detalle de Venta"
              subheader={`${totalItems} artículos`}
            />

            <CardContent>

              {cart.length === 0 ? (
                <Typography
                  sx={{ textAlign: "center", color: "text.secondary" }}
                >
                  Carrito vacío
                </Typography>
              ) : (
                cart.map((item) => (
                  <Card
                    key={item.product._id}
                    sx={{
                      mb: 2,
                      
                    }}
                  >
                    <CardContent>

                      <Typography
                        sx={{ fontWeight: 700 }}
                      >
                        {item.product.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.quantity} × $
                        {item.product.price}
                      </Typography>

                      <Typography
                        color="primary"
                        sx={{ fontWeight: 900 }}
                      >
                        $
                        {(
                          item.quantity *
                          item.product.price
                        ).toLocaleString()}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ minWidth: 45, padding: 0 , color: 'white', frontWeight: 900 }}
                          onClick={() =>
                            decreaseQty(
                              item.product._id
                            )
                          }
                        >
                          -
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ minWidth: 45, padding: 0 , color: 'white', frontWeight: 900 }}
                          onClick={() =>
                            addToCart(item.product)
                          }
                        >
                          +
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            removeItem(
                              item.product._id
                            )
                          }
                        >
                          Eliminar
                        </Button>
                      </Box>

                    </CardContent>
                  </Card>
                ))
              )}

              <Divider sx={{ my: 3 }} />

              <Card
                sx={{
                  bgcolor: "success.main",
                  color: "white",
                  mb: 2,
                }}
              >
                <CardContent>
                  <Typography variant="caption">
                    Total
                  </Typography>

                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: {
                        xs: "2rem",
                        md: "3rem",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    $
                    {total.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>

              <FormControl fullWidth>
                <InputLabel>
                  Método de pago
                </InputLabel>

                <Select
                  value={paymentMethod}
                  label="Método de pago"
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as any
                    )
                  }
                >
                  <MenuItem value="cash">
                    Efectivo
                  </MenuItem>

                  <MenuItem value="card">
                    Tarjeta
                  </MenuItem>

                  <MenuItem value="transfer">
                    Transferencia
                  </MenuItem>
                </Select>
              </FormControl>

              {paymentMethod === "cash" && (
                <>
                  <TextField
                    fullWidth
                    type="number"
                    label="Monto recibido"
                    sx={{ mt: 2 }}
                    value={amountPaid || ""}
                    onChange={(e) =>
                      setAmountPaid(
                        Number(e.target.value)
                      )
                    }
                  />

                  <Card
                    sx={{
                      mt: 2,
                      bgcolor: "#f0fdf4",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="caption"
                      >
                        Cambio
                      </Typography>

                      <Typography
                        variant="h5"
                        color="success.main"
                        sx={{ fontWeight: 900 }}
                      >
                        $
                        {Math.max(
                          change,
                          0
                        ).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </>
              )}

              <Button
                fullWidth
                size="large"
                variant="contained"
                color="success"
                startIcon={
                  <PointOfSaleIcon />
                }
                sx={{
                  mt: 3,
                  py: 2,
                  fontWeight: 900,
                }}
                disabled={
                  loading ||
                  cart.length === 0 ||
                  (paymentMethod === "cash" &&
                    amountPaid < total)
                }
                onClick={handleCheckout}
              >
                {loading
                  ? "Procesando..."
                  : `Finalizar Venta • $${total.toLocaleString()}`}
              </Button>

            </CardContent>
          </Card>
        </Grid>
        </Container>
        </Box>
);
};
export default POSPage;