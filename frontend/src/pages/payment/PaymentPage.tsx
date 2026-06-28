import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PaymentsIcon from "@mui/icons-material/Payments";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  createSubscriptionPayment,
  paySubscription,
} from "@/services/users.service";

type SubscriptionPlan =
  | "basic"
  | "medium"
  | "premium";

type PaymentMethod =
  | "moncash"
  | "mercado pago"
  | "transfer";

interface PaymentData {
  plan: SubscriptionPlan;
  basePrice: number;
  fee: number;
  total: number;
  qr: string;
}

export default function PaymentPage() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [confirming, setConfirming] =
    useState(false);

  const [plan, setPlan] =
    useState<SubscriptionPlan>("basic");

  const [method, setMethod] =
    useState<PaymentMethod>("moncash");

  const [paymentData, setPaymentData] =
    useState<PaymentData | null>(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const response: any =
        await createSubscriptionPayment(
          plan
        );

      console.log(
        "PAYMENT RESPONSE:",
        response
      );

      const data =
        response?.data || response;

      setPaymentData(data);
    } catch (error) {
      console.error(error);
      alert(
        "Error generando el pago"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirming(true);

      const result =
        await paySubscription(
          plan,
          method
        );

      console.log(
        "PAYMENT RESULT:",
        result
      );

      alert(
        "Suscripción activada correctamente"
      );

      navigate("/app/dashboard");
    } catch (error) {
      console.error(error);
      alert(
        "Error confirmando pago"
      );
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, md: 4 },
        px: { xs: 2, md: 0 },
      }}
    >
      <Container maxWidth="lg">

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-end",
            mb: 4,
            pb: 3,
            borderBottom:
              "2px solid #e0e7ff",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, color: "white" }}
            >
              Suscripción{" "}
              <Box
                component="span"
                sx={{
                  color: "#6366f1",
                }}
              >
                Premium
              </Box>
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "#64748b",
                letterSpacing: 2,
                textTransform:
                  "uppercase",
              }}
            >
              Renovación y gestión
              de suscripción
            </Typography>
          </Box>
        </Box>

        {/* KPIs */}

        <Grid
          container
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  PLAN
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900 }}
                >
                  {plan.toUpperCase()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  MÉTODO
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900 }}
                >
                  {method}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card>
              <CardContent>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  TOTAL
                </Typography>

                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900, color: "success.main" }}
                >
                  $
                  {paymentData?.total ??
                    0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={3}
        >

          {/* CONFIG */}

          <Grid
            size={{
              xs: 12,
              md: 5,
            }}
          >
            <Card>
              <CardHeader
                avatar={
                  <WorkspacePremiumIcon />
                }
                title="Configuración"
                subheader="Seleccione plan y método"
              />

              <CardContent>

                <FormControl
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <InputLabel>
                    Plan
                  </InputLabel>

                  <Select
                    value={plan}
                    label="Plan"
                    onChange={(e) =>
                      setPlan(
                        e.target
                          .value as SubscriptionPlan
                      )
                    }
                  >
                    <MenuItem value="basic">
                      Basic
                    </MenuItem>

                    <MenuItem value="medium">
                      Medium
                    </MenuItem>

                    <MenuItem value="premium">
                      Premium
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                >
                  <InputLabel>
                    Método
                  </InputLabel>

                  <Select
                    value={method}
                    label="Método"
                    onChange={(e) =>
                      setMethod(
                        e.target
                          .value as PaymentMethod
                      )
                    }
                  >
                    <MenuItem value="moncash">
                      MonCash
                    </MenuItem>

                    <MenuItem value="mercado pago">
                      Mercado Pago
                    </MenuItem>

                    <MenuItem value="transfer">
                      Transferencia
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  startIcon={
                    <PaymentsIcon />
                  }
                  sx={{ mt: 3 }}
                  onClick={
                    handleGenerate
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Generando..."
                    : "Generar Pago"}
                </Button>

              </CardContent>
            </Card>

            {paymentData && (
              <Card
                sx={{ mt: 3 }}
              >
                <CardHeader
                  title="Resumen"
                />

                <CardContent>
                  <Box
                    sx={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 2,
                    }}
                  >
                    <Chip
                      label={`Plan ${paymentData.plan}`}
                      color="primary"
                    />

                    <Typography>
                      Base: $
                      {
                        paymentData.basePrice
                      }
                    </Typography>

                    <Typography>
                      Comisión: $
                      {paymentData.fee}
                    </Typography>

                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 900, color: "success.main" }}
                    >
                      Total: $
                      {
                        paymentData.total
                      }
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* QR */}

          <Grid
            size={{
              xs: 12,
              md: 7,
            }}
          >
            <Card
              sx={{
                height: "100%",
              }}
            >
              <CardHeader
                avatar={
                  <QrCode2Icon />
                }
                title="Pago"
                subheader="Escanee el QR para completar la transacción"
              />

              <CardContent>

                {!paymentData?.qr ? (
                  <Box
                    sx={{
                      height: 400,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexDirection:
                        "column",
                      gap: 2,
                    }}
                  >
                    <QrCode2Icon
                      sx={{
                        fontSize: 80,
                        color:
                          "text.secondary",
                      }}
                    />

                    <Typography
                      color="text.secondary"
                    >
                      Genera un pago
                      para visualizar
                      el QR
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                      gap: 3,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor:
                          "white",
                        p: 3,
                        borderRadius: 3,
                      }}
                    >
                      <QRCodeCanvas
                        value={
                          paymentData.qr
                        }
                        size={260}
                        includeMargin
                        level="H"
                      />
                    </Box>

                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={
                        confirming ? (
                          <CircularProgress
                            size={20}
                            color="inherit"
                          />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      onClick={
                        handleConfirm
                      }
                      disabled={
                        confirming
                      }
                    >
                      {confirming
                        ? "Confirmando..."
                        : "Confirmar Pago"}
                    </Button>
                  </Box>
                )}

              </CardContent>
            </Card>
          </Grid>

        </Grid>

      </Container>
    </Box>
  );
}