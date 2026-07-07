import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Card, CardContent, CardHeader, TextField, Button, Grid, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuth } from "../../context/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as API from "../../services/users.service";
import { auth } from "../../firebase/config";
import SkeletonLoader from "../../components/common/SkeletonLoader";


const UserForm = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const isEdit = Boolean(id);

  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const isOwnProfile = isEdit && currentUser?._id === id;

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    role: "employee" as API.UserRole,
    isActive: true,
    plan: "free" as API.PlanType,
    phone: "",    
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

  const canAssignRole = (role: API.UserRole) => {
    if (!currentUser) return false;

    // Allow preserving the current role when editing own profile.
    if (isEdit && currentUser._id === id && role === currentUser.role) {
      return true;
    }

    if (currentUser.role === "superadmin") {
      // Superadmin puede asignar admin, employee
      return ["admin", "employee"].includes(role);
    }
    if (currentUser.role === "admin") {
      // Admin puede asignar employee
      return ["employee"].includes(role);
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

        const res = await API.getUserById(id);

       if (!res.data) {
        throw new Error("No user data received");
       }

       const user = res.data.user;

      setForm({
          name: user.name || "",
          lastName: user.lastName || "",
          email: user.email || "",
          password: "",
          role: user.role || "employee",
          isActive: user.isActive ?? true,
          plan: user.plan || "free",
          phone: user.phone || "",          
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
        alert(t("users.forms.loadError"));
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [id]);

  // =========================
  // CHANGE
  // =========================

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value, type, checked } = e.target;

  if (name.startsWith("address.")) {
    const addressField = name.split(".")[1];

    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [addressField]: value,
      },
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }
};

  const handleSelectChange = (
  e: SelectChangeEvent<API.UserRole | API.PlanType>
) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    if (!canManageUsers) {
      alert(t("users.forms.noPermission"));
      return false;
    }

    if (
      !form.name ||
      !form.lastName ||
      !form.email
    ) {
      alert(t("users.forms.completeFields"));
      return false;
    }

    if (!isEdit && !form.password) {
      alert(t("users.forms.passwordRequired"));
      return false;
    }

    if (!canAssignRole(form.role)) {
      alert(t("users.forms.invalidRole"));
      return false;
    }

    if (isOwnProfile && !form.isActive) {
      alert(t("users.forms.selfDisable"));
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

    const payload = {
      ...form,
    };

    if (isEdit) {

      if (!id) {
        throw new Error(
          "User ID is missing."
        );
      }

      const {
        password,
        email, // no se actualiza
        ...updatePayload
      } = payload;

      await API.updateUser(
        id,
        updatePayload
      );

      alert(t("users.forms.updated"));

    } else {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

      const firebaseUser =
        userCredential.user;

      const {
        password,
        ...employeePayload
      } = form;

      await API.createEmployee({
        ...employeePayload,
        firebaseUid:
          firebaseUser.uid,
      });

      alert(t("users.forms.created"));
    }

    navigate("/app/users");

  } catch (err: any) {

    console.error(err);

    const message =
      err?.response?.data?.message ||
      err?.message ||
      (isEdit ? t("users.forms.updateError") : t("users.forms.createError"));

    alert(message);

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
          <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>{t("users.forms.accessDenied")}</h2>
          <p style={{color: '#94a3b8', marginBottom: '1.5rem'}}>{t("users.forms.teamPermission")}</p>
          <Button variant="outlined" onClick={() => navigate('/app/users')}>{t("users.forms.back")}</Button>
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
          title={isEdit ? t("users.forms.editTitle") : t("users.forms.newTitle")}
          subheader={t("users.forms.subtitle")}
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
                  label={t("users.forms.name")}
                  placeholder={t("users.forms.namePlaceholder")}
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
                  label={t("users.forms.lastName")}
                  placeholder={t("users.forms.lastNamePlaceholder")}
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
                  label={t("users.forms.email")}
                  placeholder={t("users.forms.emailPlaceholder")}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isEdit}
                  helperText={isEdit ? t("users.forms.emailHelper") : ""}
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
                    label={t("users.forms.password")}
                    placeholder={t("users.forms.passwordPlaceholder")}
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
    label={t("users.forms.phone")}
    name="phone"
    value={form.phone}
    onChange={handleChange}
  />
</Grid>

{/* Dirección */}
<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label={t("users.forms.street")}
    name="address.street"
    value={form.address.street}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label={t("users.forms.number")}
    name="address.number"
    value={form.address.number}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label={t("users.forms.city")}
    name="address.city"
    value={form.address.city}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label={t("users.forms.state")}
    name="address.state"
    value={form.address.state}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label={t("users.forms.country")}
    name="address.country"
    value={form.address.country}
    onChange={handleChange}
  />
</Grid>

<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    label={t("users.forms.postalCode")}
    name="address.postalCode"
    value={form.address.postalCode}
    onChange={handleChange}
  />
</Grid>
              {/* Rol y Plan */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>{t("users.forms.adminRole")}</InputLabel>
                  <Select
                    value={form.role}
                    onChange={handleSelectChange}
                    label={t("users.forms.adminRole")}
                    name="role"
                  >
                    {isEdit && !["admin", "employee"].includes(form.role) && (
                      <MenuItem value={form.role}>
                        {form.role === "superadmin"
                          ? t("users.forms.superadmin")
                          : form.role === "admin"
                          ? t("users.forms.admin")
                          : t("users.forms.employee")}
                      </MenuItem>
                    )}
                    <MenuItem value="employee">{t("users.forms.employee")}</MenuItem>
                    {currentUser?.role === "superadmin" && (
                      <MenuItem value="admin">{t("users.forms.admin")}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>{t("users.forms.subscriptionPlan")}</InputLabel>
                  <Select
                   value={form.plan}
                   onChange={handleSelectChange}
                   label="Plan de Suscripción"
                   name="plan"
                  >
                  
                   <MenuItem value="free">{t("users.forms.free")}</MenuItem>
                   <MenuItem value="basic">{t("users.forms.basic")}</MenuItem>
                   <MenuItem value="medium">{t("users.forms.medium")}</MenuItem>
                   <MenuItem value="premium">{t("users.forms.premium")}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Estado Activo */}
              <Grid size={12}>
                <FormControlLabel
                  disabled={isOwnProfile}
                  control={
                    <Switch
                      checked={form.isActive}
                      onChange={(_, checked) =>
                        setForm((prev) => ({
                          ...prev,
                          isActive: checked,
                        }))
                      }
                    />
                  }
                  label={
                    isOwnProfile
                      ? t("users.forms.selfUserActive")
                      : t("users.forms.userActive")
                  }
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
                  {t("users.forms.cancel")}
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ textTransform: 'none', fontSize: 16, boxShadow: 2 }}
                >
                  {loading ? t("users.forms.saving") : isEdit ? t("users.forms.updateUser") : t("users.forms.createUser")}
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