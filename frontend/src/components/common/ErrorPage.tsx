import { Box, Button, Paper, Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError() as any;

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
      <Paper elevation={0} sx={{ width: '100%', maxWidth: 520, p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="overline" color="error.main" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          Error inesperado
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 1.5, color: 'text.primary' }}>
          Algo salió mal
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, maxWidth: 400, mx: 'auto' }}>
          La aplicación encontró un problema inesperado. Puedes intentar recargar la vista para continuar.
        </Typography>
        <Box component="pre" sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'grey.100', overflow: 'auto', fontSize: '0.8rem' }}>
          {error?.message || 'Error desconocido'}
        </Box>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 3, borderRadius: 999 }}>
          Recargar
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorPage;