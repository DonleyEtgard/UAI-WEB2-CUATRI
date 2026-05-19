import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../features/auth/AuthContext";


import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Paper,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  Business,
  ShoppingCart,
  People,
  Inventory,
  Analytics,
  Security,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";

const HomePage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Mientras carga la sesión, mostramos un fallback en vez de pantalla vacía
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">Cargando...</Typography>
      </Box>
    );
  }

  // Si está autenticado, evitamos frame en blanco mientras redirigimos.
  if (isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">Redirigiendo...</Typography>
      </Box>
    );
  }

  const features = [
    {
      icon: <Business sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Gestión Empresarial",
      description:
        "Sistema completo para administrar tu negocio de manera eficiente y profesional.",
    },
    {
      icon: <ShoppingCart sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Punto de Venta",
      description:
        "Procesamiento rápido de ventas con integración completa al inventario.",
    },
    {
      icon: <People sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Gestión de Clientes",
      description:
        "Mantén un registro completo de tus clientes y su historial de compras.",
    },
    {
      icon: <Inventory sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Control de Inventario",
      description:
        "Seguimiento en tiempo real de stock, movimientos y alertas automáticas.",
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Reportes y Analytics",
      description:
        "Informes detallados y métricas para tomar mejores decisiones.",
    },
    {
      icon: <Security sx={{ fontSize: 40, color: "#6366f1" }} />,
      title: "Seguridad Avanzada",
      description:
        "Protección de datos con roles y permisos personalizables.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  fontWeight: 700,
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                HAITIBIZ ERP
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 300,
                  lineHeight: 1.4,
                }}
              >
                Sistema de Gestión Empresarial Profesional
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                Gestiona ventas, inventario, clientes y operaciones desde una sola
                plataforma. Funciona online y offline, con sincronización
                automática.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "#6366f1",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#f1f5f9",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Comenzar Ahora
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "white",
                    color: "white",
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "#f1f5f9",
                      bgcolor: "rgba(255,255,255,0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Stack>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 300, md: 400 },
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    width: "100%",
                    maxWidth: 400,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "#6366f1", fontWeight: 700, mb: 2, textAlign: "center" }}
                  >
                    🏪
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1e293b", fontWeight: 600, mb: 2, textAlign: "center" }}
                  >
                    App Instalable
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", textAlign: "center", mb: 3 }}
                  >
                    Funciona como aplicación nativa en Android, iOS y PC
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "center", flexWrap: "wrap" }}
                  >
                    <Chip label="PWA" size="small" sx={{ bgcolor: "#6366f1", color: "white" }} />
                    <Chip label="Offline" size="small" sx={{ bgcolor: "#10b981", color: "white" }} />
                    <Chip label="Responsive" size="small" sx={{ bgcolor: "#f59e0b", color: "white" }} />
                  </Stack>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              color: "#1e293b",
              mb: 3,
            }}
          >
            Características Principales
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#64748b",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Todo lo que necesitas para gestionar tu negocio de manera eficiente
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(99,102,241,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: "center" }}>
                <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    mb: 2,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "#1e293b", color: "white", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 3,
            }}
          >
            ¿Listo para transformar tu negocio?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Únete a miles de empresas que ya confían en HAITIBIZ ERP
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#6366f1",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#5855eb",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Crear Cuenta Gratis
            </Button>
            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#6366f1",
                  bgcolor: "#6366f1",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Contactar Soporte
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#0f172a", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                HAITIBIZ ERP
              </Typography>
              <Typography variant="body2" sx={{ color: "#94a3b8", lineHeight: 1.6, mb: 2 }}>
                Sistema de gestión empresarial profesional diseñado para pequeñas y medianas empresas.
                Funciona online y offline con sincronización automática.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="v1.0.0" size="small" sx={{ bgcolor: "#6366f1", color: "white" }} />
                <Chip label="PWA Ready" size="small" sx={{ bgcolor: "#10b981", color: "white" }} />
              </Stack>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Navegación
              </Typography>
              <Stack spacing={1}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#94a3b8",
                    justifyContent: "flex-start",
                    p: 0,
                    minHeight: "auto",
                    "&:hover": { color: "white" },
                  }}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#94a3b8",
                    justifyContent: "flex-start",
                    p: 0,
                    minHeight: "auto",
                    "&:hover": { color: "white" },
                  }}
                >
                  Crear Cuenta
                </Button>
                <Button
                  component={Link}
                  to="/contact"
                  sx={{
                    color: "#94a3b8",
                    justifyContent: "flex-start",
                    p: 0,
                    minHeight: "auto",
                    "&:hover": { color: "white" },
                  }}
                >
                  Contacto
                </Button>
              </Stack>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contacto
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Email sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    soporte@haitibiz.com
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Phone sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    +54 9 341 XXX XXXX
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LocationOn sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                    Rosario, Santa Fe, Argentina
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 4, bgcolor: "#334155" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              © 2024 HAITIBIZ ERP. Todos los derechos reservados.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", cursor: "pointer", "&:hover": { color: "white" } }}
              >
                Privacidad
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", cursor: "pointer", "&:hover": { color: "white" } }}
              >
                Términos
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", cursor: "pointer", "&:hover": { color: "white" } }}
              >
                Soporte
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
export default HomePage;