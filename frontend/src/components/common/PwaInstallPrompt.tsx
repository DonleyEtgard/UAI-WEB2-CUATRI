import { Alert, Box, Button, Typography } from '@mui/material';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export const PwaInstallPrompt = () => {
  const { deferredPrompt, promptInstall, isInstalled } = usePwaInstall();

  if (!deferredPrompt || isInstalled) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 9999 }}>
      <Alert
        severity="info"
        action={
          <Button color="inherit" size="small" onClick={() => promptInstall()}>
            Instalar
          </Button>
        }
      >
        <Typography variant="body2" sx={{ display: 'inline' }}>
          ✅ Puedes instalar esta aplicación en tu dispositivo para usarla como una app real.
        </Typography>
      </Alert>
    </Box>
  );
};
