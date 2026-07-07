import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";

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
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import PaymentsIcon from "@mui/icons-material/Payments";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import {
  createSubscriptionPayment,  
  type CreateSubscriptionPaymentResponse
} from "../../services/payments.service"; // Ajusta la ruta si es necesario

type SubscriptionPlan =
  | "basic"
  | "medium"
  | "premium";

type PaymentMethod =  
  | "moncash"
  | "mercadopago";

const prices = {
  moncash: {
    basic: 3000,
    medium: 10800,
    premium: 25000,
  },

  mercadopago: {
    basic: 45000,
    medium: 130000,
    premium: 250000,
  },
} as const;

export default function PaymentPage() {
  const { t } = useTranslation();
  const [loading, setLoading] =
    useState(false);

  const [plan, setPlan] =
    useState<SubscriptionPlan>("basic");

  const [method, setMethod] =
    useState<PaymentMethod>("moncash");

   const [paymentData, setPaymentData] =
    useState<CreateSubscriptionPaymentResponse | null>(null);
     
  const currentPrice =
    prices[method][plan];

   const currentFee =
    method === "moncash"
    ? currentPrice * 0.05
    : 0;

   const currentTotal =
    currentPrice + currentFee;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setPaymentData(null);

      const result = await createSubscriptionPayment(plan, method);
      const response = (result as any).data ?? result;

      console.log("PAYMENT RESPONSE:", response);

      if (response?.success === false) {
        throw new Error(response?.message || t("payment.payment.paymentError"));
      }

      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      const qr = response.qr;
      if (qr) {
        setPaymentData({
          ...response,
          qr,
        });
      }
    } catch (error: any) {
      console.error("❌ ERROR GENERANDO PAGO COMPLETO:", error);
      console.error("❌ RESPONSE DATA:", error?.response?.data);
      console.error("❌ STATUS:", error?.response?.status);

      alert(
        error?.response?.data?.message ||
        error?.message ||
        t("payment.payment.generateError")
      );
    } finally {
      setLoading(false);
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
              {t("payment.payment.title")}{" "}
              <Box
                component="span"
                sx={{
                  color: "#6366f1",
                }}
              >
                {t("payment.payment.premium")}
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
              {t("payment.payment.subtitle")}
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
                  {t("payment.payment.plan")}
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
                  {t("payment.payment.method")}
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
                  {t("payment.payment.total")}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                 fontWeight: 900,
                  color: "success.main"
                  }}
                  >
                ${currentTotal}
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
                title={t("payment.payment.configuration")}
                subheader={t("payment.payment.selectPlanMethod")}
              />

              <CardContent>

                <FormControl
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  <InputLabel>
                    {t("payment.payment.plan")}
                  </InputLabel>

                  <Select
                    value={plan}
                    label={t("payment.payment.plan")}
                    onChange={(e) =>
                      setPlan(
                        e.target
                          .value as SubscriptionPlan
                      )
                    }
                  >
                    <MenuItem value="basic">
                      {t("payment.payment.basic")}
                    </MenuItem>

                    <MenuItem value="medium">
                      {t("payment.payment.medium")}
                    </MenuItem>

                    <MenuItem value="premium">
                      {t("payment.payment.premiumPlan")}
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                >
                  <InputLabel>
                    {t("payment.payment.method")}
                  </InputLabel>

                  <Select
                    value={method}
                    label={t("payment.payment.method")}
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

                    <MenuItem value="mercadopago">
                      Mercado Pago
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
                    ? t("payment.payment.generating")
                    : t("payment.payment.generatePayment")}
                </Button>

              </CardContent>
            </Card>
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
                title={t("payment.payment.payment")}
                subheader={t("payment.payment.scanQr")}
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
                      {t("payment.payment.generateToViewQr")}
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

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {t("payment.payment.paymentVerified")}
                    </Typography>
                    {paymentData.status && (
                      <Chip label={`${t("payment.payment.status")}: ${paymentData.status}`} color="info" sx={{ mt: 2 }} />
                    )}
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
