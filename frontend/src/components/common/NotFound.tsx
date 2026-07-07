import { Box, Button, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: 'center', background: 'transparent' }}>
        <Typography variant="h1" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '0.1em' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, color: 'text.primary' }}>
          Página no encontrada
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 320, mx: 'auto' }}>
          La ruta que intentas abrir no existe o fue movida.
        </Typography>
        <Button component={Link} to="/" variant="contained" sx={{ mt: 3, borderRadius: 999 }}>
          Volver al inicio
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;