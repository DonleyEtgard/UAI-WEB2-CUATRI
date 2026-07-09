import React from 'react';
import { Box, Typography, Card, CardContent, CardHeader, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SettingsPage: React.FC = () => {
  // Aquí iría la lógica para cargar y guardar las configuraciones

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Configuración del Sistema
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
            Gestiona los parámetros y preferencias generales de la aplicación.
          </Typography>
        </Box>

        {/* SECCIONES DE CONFIGURACIÓN */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Perfil de la Empresa */}
          <Card>
            <CardHeader
              title="Perfil de la Empresa"
              subheader="Edita la información pública y de contacto de tu negocio."
            />
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Nombre de la Empresa"
                  placeholder="Mi Empresa S.A."
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Email de Contacto"
                  placeholder="contacto@miempresa.com"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Configuración Financiera */}
          <Card>
            <CardHeader
              title="Finanzas e Impuestos"
              subheader="Define la moneda por defecto y las tasas de impuestos."
            />
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="currency-select-label">Moneda</InputLabel>
                  <Select
                    labelId="currency-select-label"
                    label="Moneda"
                    defaultValue="USD"
                  >
                    <MenuItem value="USD">USD - Dólar Americano</MenuItem>
                    <MenuItem value="EUR">EUR - Euro</MenuItem>
                    <MenuItem value="HTG">HTG - Gourde Haitiano</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Impuesto General (%)"
                  placeholder="18"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>

        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;