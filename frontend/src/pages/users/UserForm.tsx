import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Card, CardContent, CardHeader, TextField, Button, Grid, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import type { AppUser } from "../../types/firestore";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const UserForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee" as AppUser["role"],
    isActive: true,
    plan: "free" as AppUser["plan"],
    phone: "",    
    image: "",
    address: {
      street: "",
      number: "",
      city: "",
      state: "",
      country: "Argentina",
      postalCode: "",
    },
  });

  // =========================
  // RBAC
  // =========================

  const canManageUsers =
    currentUser?.role === "admin" ||
    currentUser?.role === "superadmin";

  const canAssignRole = (role: AppUser["role"]) => {
    if (currentUser?.role === "superadmin") {
      return ["admin", "employee", "client"].includes(role);
    }
    if (currentUser?.role === "admin") {
      return ["employee", "client"].includes(role);
    }
    return false;
  };

  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        setLoadingUser(true);

        const res = await API.get(`/users/${id}`);

       console.log(res.data);

       const user = res.data.data.user;

      setForm({
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          password: "",
          role: user.role || "employee",
          isActive: user.isActive ?? true,
          plan: user.plan || "free",
          phone: user.phone || "",          
          image: user.image || "",
          address: {
            street: user.address?.street || "",
            number: user.address?.number || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            country: user.address?.country || "Argentina",
            postalCode: user.address?.postalCode || "",
          },
      });
      } catch (err) {
        console.error(err);
        alert("Error cargando usuario");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [id]);

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    if (!canManageUsers) {
      alert("No tienes permisos");
      return false;
    }

    if (
      !form.name ||
      !form.lastName ||
      !form.email
    ) {
      alert("Completa todos los campos");
      return false;
    }

    if (!isEdit && !form.password) {
      alert("Password requerida");
      return false;
    }

    if (!canAssignRole(form.role)) {
      alert("No puedes asignar este rol");
      return false;
    }

    return true;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      if (isEdit) {
        const { password, ...updatePayload } = form; // Excluimos la contraseña en la edición
        await API.patch(`/users/${id}`, updatePayload);

        alert("Usuario actualizado");
      } else {
        await API.post("/users/employees", form);

        alert("Usuario creado");
      }

      navigate("/app/users");

    } catch (err) {
      console.error(err);
      alert(
        isEdit
          ? "Error actualizando usuario"
          : "Error creando usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GUARD
  // =========================

  if (!canManageUsers) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 4 }}>
        <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Box sx={{ fontSize: 48, mb: 2 }}>⚠️</Box>
          <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>Acceso Denegado</h2>
          <p style={{color: '#94a3b8', marginBottom: '1.5rem'}}>No tienes permisos para gestionar el equipo.</p>
          <Button variant="outlined" onClick={() => navigate('/app/users')}>Volver</Button>
        </Card>
      </Box>
    );
  }

  if (loadingUser) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 2, sm: 4 } }}>
        <SkeletonLoader count={6} height={40} />
      </Box>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 2, sm: 4 }, animation: 'fadeIn 0.5s ease-in-out' }} ref={pageRef}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardHeader 
          title={isEdit ? "Editar Perfil" : "Nuevo Integrante"}
          subheader="Configura la información de acceso y privilegios."
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
        />
        
        <CardContent sx={{ pt: 4 }}>
          <Box component="form" onSubmit={(e: any) => { e.preventDefault(); handleSubmit(); }}>
            <Grid container spacing={3}>
              {/* Nombre y Apellido */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  placeholder="Ej. John"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  placeholder="Ej. Doe"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Email */}
              <Grid size={12}>
                <TextField
                  fullWidth
                  type="email"
                  required
                  label="Correo Electrónico"
                  placeholder="john@empresa.com"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  variant="outlined"
                  size="medium"
                />
              </Grid>

              {/* Contraseña (solo crear) */}
              {!isEdit && (
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    required
                    label="Contraseña"
                    placeholder="••••••••"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    variant="outlined"
                    size="medium"
                  />
                </Grid>
              )}
                {/* Teléfono */}
<Grid size={12}>
  <TextField
    fullWidth
    label="Teléfono"
    name="phone"
    value={form.phone}
    onChange={handleChange}
  />
</Grid>

{/* Imagen */}
<Grid size={12}>
  <TextField
    fullWidth
    label="URL de Imagen"
    name="image"
    value={form.image}
    onChange={handleChange}
  />
</Grid>

{/* Dirección */}
<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Calle"
    name="address.street"
    value={form.address.street}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Número"
    name="address.number"
    value={form.address.number}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Ciudad"
    name="address.city"
    value={form.address.city}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Provincia"
    name="address.state"
    value={form.address.state}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="País"
    name="address.country"
    value={form.address.country}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label="Código Postal"
    name="address.postalCode"
    value={form.address.postalCode}
    onChange={handleChange}
  />
</Grid>
              {/* Rol y Plan */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Rol Administrativo</InputLabel>
                  <Select
                    value={form.role}
                    onChange={handleChange as any} // Cast to any to handle MUI's SelectChangeEvent
                    label="Rol Administrativo"
                    name="role"
                  >
                    <MenuItem value="employee">Empleado</MenuItem>
                    <MenuItem value="client">Cliente / Usuario</MenuItem>
                    {currentUser?.role === "superadmin" && (
                      <MenuItem value="admin">Administrador</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Plan de Suscripción</InputLabel>
                  <Select
                    value={form.plan}
                    onChange={handleChange as any} // Cast to any to handle MUI's SelectChangeEvent
                    label="Plan de Suscripción"
                    name="plan"
                  >
                    <MenuItem value="free">Free</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Estado Activo */}
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={handleChange}
                      name="isActive"
                      size="medium"
                    />
                  }
                  label="Usuario activo y con acceso al sistema"
                />
              </Grid>

              {/* Botones */}
              <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<CancelIcon />}
                  onClick={() => navigate("/app/users")}
                  sx={{ textTransform: 'none', fontSize: 16 }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ textTransform: 'none', fontSize: 16, boxShadow: 2 }}
                >
                  {loading ? "Guardando..." : isEdit ? "Actualizar Usuario" : "Crear Usuario"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserForm;