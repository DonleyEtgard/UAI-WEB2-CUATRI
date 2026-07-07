import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


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
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#050816",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="#94a3b8">
          Cargando...
        </Typography>
      </Box>
    );
  }

  const features = [
    {
      icon: (
        <Business
          sx={{
            fontSize: 40,
            color: "#8b5cf6",
          }}
        />
      ),
      title: t("home.feature1Title"),
      description:
        t("home.feature1Description"),
    },
    {
      icon: (
        <ShoppingCart
          sx={{
            fontSize: 40,
            color: "#8b5cf6"
          }}
        />
      ),
      title: t("home.feature2Title"),
      description:
        t("home.feature2Description"),
    },
    {
      icon: (
        <People
          sx={{
            fontSize: 40,
            color: "#8b5cf6"
          }}
        />
      ),
      title: t("home.feature3Title"),
      description:
        t("home.feature3Description"),
    },
    {
      icon: (
        <Inventory
          sx={{
            fontSize: 40,
            color: "#8b5cf6"
          }}
        />
      ),
      title: t("home.feature1Title"), // Assuming this maps to a feature, reusing for example
      description:
        t("home.feature1Description"), // Assuming this maps to a feature, reusing for example
    },
    {
      icon: (
        <Analytics
          sx={{
            fontSize: 40,
            color: "#8b5cf6"
          }}
        />
      ),
      title: "Reportes y Analytics",
      description:
        "Informes detallados y métricas para tomar mejores decisiones.",
    },
    {
      icon: (
        <Security
          sx={{
            fontSize: 40,
            color: "#8b5cf6"
          }}
        />
      ),
      title: t("home.feature3Title"), // Assuming this maps to a feature, reusing for example
      description:
        t("home.feature3Description"), // Assuming this maps to a feature, reusing for example
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(99,102,241,0.25), transparent 30%), radial-gradient(circle at bottom right, rgba(139,92,246,0.18), transparent 30%), #050816",
        color: "white",
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.92) 50%, rgba(88,28,135,0.85) 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Glow */}
        <Box
          sx={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "rgba(99,102,241,0.18)",
            filter: "blur(120px)",
            top: -120,
            right: -120,
            zIndex: 0,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 4,
              alignItems: "center",
            }}
          >
            {/* LEFT */}
            <Box sx={{ flex: 1 }}>
              <Chip
                label="⚡ ERP • POS • SaaS"
                sx={{
                  mb: 3,
                  bgcolor:
                    "rgba(99,102,241,0.15)",
                  color: "#c4b5fd",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                }}
              />

              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: {
                    xs: "3rem",
                    md: "5rem",
                  },
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.1,
                  background:
                    "linear-gradient(90deg,#ffffff,#a5b4fc,#c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:
                    "transparent",
                  letterSpacing: "0.05em",
                  textShadow:
                    "0 0 25px rgba(99,102,241,0.35)",
                }}
              >
                💠 HAITIBIZ
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  color: "#cbd5e1",
                  fontWeight: 300,
                }}
              > 
                {t("home.heroSubtitle")}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 5,
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  maxWidth: 650,
                }}
              > 
                {t("home.feature1Description")} {t("home.feature2Description")} {t("home.feature3Description")}
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    background:
                      "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    px: 5,
                    py: 1.7,
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow:
                      "0 0 25px rgba(99,102,241,0.45)",

                    "&:hover": {
                      transform:
                        "translateY(-3px)",
                    },
                  }}
                >
                  {t("home.getStarted")}
                </Button>

                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor:
                      "rgba(255,255,255,0.2)",
                    color: "white",
                    px: 5,
                    py: 1.7,
                    borderRadius: "14px",

                    "&:hover": {
                      borderColor: "#8b5cf6",
                      bgcolor:
                        "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  {t("navigation.publicNavbar.login")}
                </Button>
              </Stack>
            </Box>

            {/* RIGHT */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: {
                    xs: 320,
                    md: 450,
                  },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    borderRadius: "28px",
                    background:
                      "rgba(15,23,42,0.75)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    backdropFilter:
                      "blur(18px)",
                    width: "100%",
                    maxWidth: 430,
                    boxShadow:
                      "0 0 40px rgba(99,102,241,0.25)",
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      textAlign: "center",
                      mb: 2,
                    }}
                  >
                    ⚡
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: 700,
                      mb: 2,
                      color: "white",
                    }}
                  >
                    ERP Inteligente
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "center",
                      color: "#94a3b8",
                      mb: 4,
                      lineHeight: 1.7,
                    }}
                  >
                    Plataforma cloud moderna con
                    soporte PWA, sincronización en
                    tiempo real y acceso desde
                    cualquier dispositivo.
                  </Typography>

                  <Stack
                    component={"div"}
                    direction="row"
                    spacing={1}
                    sx={{ justifyContent: "center" }}
                  >
                    <Chip
                      label="PWA"
                      sx={{
                        bgcolor: "#6366f1",
                        color: "white",
                      }}
                    />

                    <Chip
                      label="Cloud"
                      sx={{
                        bgcolor: "#8b5cf6",
                        color: "white",
                      }}
                    />

                    <Chip
                      label="Offline"
                      sx={{
                        bgcolor: "#10b981",
                        color: "white",
                      }}
                    />
                  </Stack>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FEATURES */}
      <Container
        maxWidth="lg"
        sx={{ py: { xs: 8, md: 12 } }}
      >
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 3,
              color: "white",
            }} >
            {t("home.featuresTitle")}
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: "#94a3b8", maxWidth: 700, mx: "auto", lineHeight: 1.7 }} >
            {t("home.heroSubtitle")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: "100%",
                borderRadius: "24px",
                background:
                  "rgba(15,23,42,0.75)",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
                transition: "0.35s",
                color: "white",

                "&:hover": {
                  transform:
                    "translateY(-10px)",
                  boxShadow:
                    "0 0 35px rgba(99,102,241,0.35)",
                  border:
                    "1px solid rgba(99,102,241,0.4)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Box sx={{ mb: 3 }}>
                  {feature.icon}
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    color: "white",
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#94a3b8",
                    lineHeight: 1.8,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg,#0f172a,#111827,#312e81)",
          color: "white",
          py: { xs: 8, md: 10 },
          borderTop:
            "1px solid rgba(255,255,255,0.08)",
          borderBottom:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container
          maxWidth="md"
          sx={{ textAlign: "center" }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
            }}
          > {t("home.getStarted")}
          </Typography>

          <Typography
            variant="h6"
            sx={{ mb: 5, color: "#cbd5e1", fontWeight: 300 }} >
            {t("home.heroSubtitle")}
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                px: 6,
                py: 2,
                borderRadius: "14px",
                fontWeight: 700,
              }}
            >
              {t("auth.createAccount")}
            </Button>

            <Button
              component={Link}
              to="/contact"
              variant="outlined"
              size="large"
              sx={{
                borderColor:
                  "rgba(255,255,255,0.2)",
                color: "white",
                px: 6,
                py: 2,
                borderRadius: "14px",
              }}
            >
              {t("home.contactUs")}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          background:
            "linear-gradient(to bottom,#020617,#050816)",
          color: "white",
          py: 6,
          borderTop:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              gap: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                💠 HAITIBIZ
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#94a3b8",
                  lineHeight: 1.8,
                  mb: 3,
                }}
              > 
                {t("home.heroSubtitle")}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
              >
                <Chip
                  label="v1.0.0"
                  sx={{
                    bgcolor: "#6366f1",
                    color: "white",
                  }}
                />

                <Chip
                  label="PWA Ready"
                  sx={{
                    bgcolor: "#10b981",
                    color: "white",
                  }}
                />
              </Stack>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              > {t("navigation.publicNavbar.contact")}
              </Typography> 

              <Stack spacing={2}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Email
                    sx={{
                      color: "#8b5cf6",
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#94a3b8",
                    }}
                  >
                    soporte@haitibiz.com
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Phone
                    sx={{
                      color: "#8b5cf6",
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#94a3b8",
                    }}
                  >
                    +54 9 341 XXX XXXX
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <LocationOn
                    sx={{
                      color: "#8b5cf6",
                    }}
                  />

                  <Typography
                    sx={{
                      color: "#94a3b8",
                    }}
                  >
                    Rosario, Santa Fe, Argentina
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>

          <Divider
            sx={{
              my: 4,
              bgcolor:
                "rgba(255,255,255,0.08)",
            }}
          />

          <Typography
             sx={{
           textAlign: "center",
            color: "#64748b",
            }}
                        >
              © 2026 HAITIBIZ ERP. {t("home.rightsReserved")}
                       </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;