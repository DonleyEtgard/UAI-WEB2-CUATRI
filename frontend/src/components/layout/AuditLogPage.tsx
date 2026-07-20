import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DataGridWrapper from "../common/DataGridWrapper";
import SkeletonLoader from "../common/SkeletonLoader";
import EmptyState from "../common/EmptyState";
import API from "../../services/api";

// Interfaz para los datos de un registro de auditoría
interface AuditLog {
  _id: string;
  user: {
    name: string;
    email: string;
  } | null;
  action: string;
  details: string;
  timestamp: string;
}

const AuditLogPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t , i18n } = useTranslation();

const loadLogs = async () => {
  try {
    setLoading(true);
    setError(null);

    const [productsRes, customersRes, salesRes] = await Promise.all([
      API.get("/products"),
      API.get("/customers"),
      API.get("/sales"),
    ]);

    // 👇 Agrega esto aquí
    console.log("PRODUCTS:", productsRes.data);
    console.log("CUSTOMERS:", customersRes.data);
    console.log("SALES:", salesRes.data);
  

    const activities: any[] = [];

   // Productos
productsRes.data.forEach((p: any) => {
  activities.push({
    _id: p._id,
    user: p.createdBy ?? {
      name: t("audit.page.system"),
      email: "-",
    },
    action: "product",
    details: `Producto ${p.name} creado`,
    timestamp: p.createdAt,
  });
});

// Clientes
if (customersRes.data?.data?.customers) {
  customersRes.data.data.customers.forEach((c: any) => {
    activities.push({
      _id: c._id,
      user: c.user ?? {   // ← usar user, no createdBy
        name: t("audit.page.system"),
        email: "-",
      },
      action: "customer",
      details: `Cliente ${c.name} creado`,
      timestamp: c.createdAt,
    });
  });
}

// Ventas
if (salesRes.data?.data) {
  salesRes.data.data.forEach((s: any) => {
    activities.push({
      _id: s._id,
      user: s.user ?? {   // ← usar user, no createdBy
        name: t("audit.page.system"),
        email: "-",
      },
      action: "sale",
      details: `Venta por $${s.total}`,
      timestamp: s.createdAt,
    });
  });
}

    setLogs(
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() -
          new Date(a.timestamp).getTime()
      )
    );

  } catch (err) {
    console.error(err);
    setError(t("audit.page.loadError"));
    setLogs([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadLogs();
  }, []);

  const totalLogs = logs.length;
  const creations = logs.filter((l) => l.action.includes("CREATE")).length;
  const updates = logs.filter((l) => l.action.includes("UPDATE")).length;
  const deletions = logs.filter((l) => l.action.includes("DELETE")).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", margin: 0 }}>
              {t("audit.page.title")}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginTop: "0.5rem" }}>
              {t("audit.page.subtitle")}
            </p>
          </Box>
          <Button startIcon={<RefreshIcon />} onClick={loadLogs} variant="outlined">
            {t("audit.page.refresh")}
          </Button>
        </Box>

        {/* KPIs */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: t("audit.page.totalLogs"), value: totalLogs },
            { label: t("audit.page.creations"), value: creations },
            { label: t("audit.page.updates"), value: updates },
            { label: t("audit.page.deletions"), value: deletions },
          ].map((kpi, i) => (
            <Grid key={i}  size={{ xs: 12,  sm: 6,  md: 3,  }} >
              <Card>
                <CardContent>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", margin: 0 }}>
                    {kpi.label}
                  </p>
                  <h2 style={{ fontSize: "1.875rem", fontWeight: "bold", marginTop: "0.5rem", margin: 0 }}>
                    {kpi.value}
                  </h2>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* TABLA */}
        <Card>
          <CardHeader
            title={t("audit.page.systemActivity")}
            subheader={t("audit.page.eventsList")}
          />
          <CardContent sx={{ p: 0, "& .MuiDataGrid-root": { border: "none" } }}>
            {loading ? (
              <Box sx={{ p: 2 }}>
                <SkeletonLoader count={10} height={48} />
              </Box>
            ) : error ? (
              <Box sx={{ p: 4 }}>
                <EmptyState title={t("audit.page.errorLoading")} description={error} />
              </Box>
            ) : logs.length === 0 ? (
              <Box sx={{ p: 4 }}>
                <EmptyState title={t("audit.page.noActivity")} description={t("audit.page.noActivityDescription")} />
              </Box>
            ) : (
              <DataGridWrapper
                rows={logs.map((log) => ({ ...log, id: log._id }))}
                columns={[
                  {
                    field: "user",
                    headerName: t("audit.page.user"),
                    flex: 1,
                    renderCell: (params: any) => (
                      <Box>
                        <div style={{ fontWeight: 600 }}>
                          {params.row.user?.name || t("audit.page.system")}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          {params.row.user?.email || t("audit.page.notAvailable")}
                        </div>
                      </Box>
                    ),
                  },
                  {
                    field: "action",
                    headerName: t("audit.page.action"),
                    width: 160,
                    renderCell: (params: any) => (
                      <Chip
                        label={t(`audit.actions.${params.value}`)}
                        size="small"
                        color={
                          params.value.includes("CREATE")
                            ? "success"
                            : params.value.includes("UPDATE")
                            ? "info"
                            : params.value.includes("DELETE")
                            ? "error"
                            : "default"
                        }
                      />
                    ),
                  },
                  { field: "details", headerName: t("audit.page.details"), flex: 2 },
                  {
                   field: "timestamp",
                      headerName: t("audit.page.date"),
                      width: 220,
                     renderCell: (params: any) => {
                     const localeMap: Record<string, string> = {
                     es: "es-ES",
                     en: "en-US",
                     fr: "fr-FR",
                     ht: "fr-HT",
                    };

                   return new Date(params.value).toLocaleString(
                   localeMap[i18n.language] || "en-US",
                {
                 year: "numeric",
                 month: "long",
                 day: "numeric",
                 hour: "2-digit",
                 minute: "2-digit",
                second: "2-digit",
             }
          );
        },
        },
                ]}
                pageSize={10}
              />
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuditLogPage;