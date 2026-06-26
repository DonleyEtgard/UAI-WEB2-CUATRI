import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, CardHeader, Button } from "@mui/material";
import API from "../../services/api";
import DataGridWrapper from "../../components/common/DataGridWrapper";
import SkeletonLoader from "../../components/common/SkeletonLoader";
import EmptyState from "../../components/common/EmptyState";
import UiBadge from "../../components/common/UiBadge";

interface Payment {
  amount: number;
  date: string;
  type: "initial" | "payment";
  remainingDebt: number;
}

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  debt?: number;
  payments?: Payment[];
  isActive: boolean;
  createdAt?: string;
}

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadCustomers = async () => {
  try {
    setLoading(true);

    const res = await API.get("/customers");

    console.log("RAW RESPONSE:", res);
    console.log("RESPONSE DATA:", res.data);

    const data =
      res.data?.data?.customers ||
      res.data?.customers ||
      res.data ||
      [];

    console.log("CUSTOMERS ARRAY:", data);

    setCustomers(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error loading customers:", err);
    setCustomers([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desea eliminar este cliente?")) return;

    try {
      setDeletingId(id);
      await API.delete(`/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando cliente");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================
  // KPIs
  // ==========================
  const totalCustomers = customers.length;

  const activeCustomers = customers.filter((c) => c.isActive).length;

  const newThisMonth = customers.filter((c) => {
    if (!c.createdAt) return false;
    const date = new Date(c.createdAt);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, minHeight: "100vh" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "white", margin: 0 }}>
            Clientes
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginTop: "0.5rem" }}>
            Administra tu cartera de clientes y su información de contacto.
          </p>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/app/customers/new")}
          sx={{ textTransform: "none", fontSize: 16, boxShadow: 2 }}
        >
          Nuevo Cliente
        </Button>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: "Total Clientes", value: totalCustomers },
          { label: "Activos", value: activeCustomers },
          { label: "Nuevos este mes", value: "+" + newThisMonth },
        ].map((kpi, i) => (
          <Grid size={{ xs: 12, sm: 4 }} key={i}>
            <Card>
              <CardContent>
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#64748b",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {kpi.label}
                </p>
                <h2
                  style={{
                    fontSize: "1.875rem",
                    fontWeight: "bold",
                    marginTop: "0.5rem",
                    margin: 0,
                  }}
                >
                  {kpi.value}
                </h2>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* TABLE */}
      <Card>
        <CardHeader
          title="Directorio de Clientes"
          action={
            <Button onClick={loadCustomers} size="small">
              🔄
            </Button>
          }
        />

        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 2 }}>
              <SkeletonLoader count={6} height={48} />
            </Box>
          ) : customers.length === 0 ? (
            <Box sx={{ p: 4 }}>
              <EmptyState
                title="No hay clientes"
                description="Crea tu primer cliente para comenzar."
                actionLabel="Crear cliente"
                onAction={() => navigate("/app/customers/new")}
              />
            </Box>
          ) : (
            <DataGridWrapper
              rows={customers.map((c) => ({
                ...c,
                id: c._id,
              }))}
              columns={[
               {
  field: "name",
  headerName: "Cliente",
  flex: 1,
  renderCell: (params: any) => {
    const name = params.value || "";
    const nameInitial = name.charAt(0).toUpperCase();

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
          }}
        >
          {nameInitial}
        </Box>

        <span>{name}</span>
      </Box>
    );
  },
},

                
                {
                  field: "email",
                  headerName: "Email",
                  flex: 1,
                  width: 100, 
                  
                },
                {
                  field: "phone",
                  headerName: "Teléfono",
                  width: 120,
                },
                {
  field: "debt",
  headerName: "Deuda",
  width: 120,
  renderCell: (params: any) => (
    <span>
      ${params.row.debt?.toLocaleString() || 0}
    </span>
  ),
},
{
  field: "payments",
  headerName: "Último Pago",
  width: 150,
  renderCell: (params: any) => {
    const lastPayment =
      params.row.payments?.[params.row.payments.length - 1];

    if (!lastPayment) {
      return <span>Sin pagos</span>;
    }

    return <span>${lastPayment.amount.toLocaleString()}</span>;
  },
},
                {
                  field: "isActive",
                  headerName: "Estado",
                  width: 140,
                  renderCell: (params: any) =>
                    params.value ? (
                      <UiBadge label="Activo" color="success" />
                    ) : (
                      <UiBadge label="Inactivo" color="error" />
                    ),
                },
                {
                  field: "actions",
                  headerName: "Acciones",
                  width: 120,
                  sortable: false,
                  renderCell: (params: any) => (
                    <Box
                      style={{
                        display: "flex",
                        gap: 8,
                        justifyContent: "flex-end",
                        width: "100%",
                      }}
                    >
                      <button
                        onClick={() =>
                          navigate(`/app/customers/edit/${params.row._id}`)
                        }
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 6,
                          borderRadius: 8,
                          color: "#9ca3af",
                        }}
                        title="Editar"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => handleDelete(params.row._id)}
                        disabled={deletingId === params.row._id}
                        style={{
                          background: "transparent",
                          border: 0,
                          padding: 6,
                          borderRadius: 8,
                          color: "#9ca3af",
                        }}
                        title="Eliminar"
                      >
                        {deletingId === params.row._id ? "..." : "🗑️"}
                      </button>
                    </Box>
                  ),
                },
              ]}
              pageSize={10}
              onRowClick={(params: any) =>
                navigate(`/app/customers/edit/${params.row._id}`)
              }
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomersPage;