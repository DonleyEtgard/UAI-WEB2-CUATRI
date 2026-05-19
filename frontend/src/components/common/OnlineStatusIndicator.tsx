import { useOnline } from '../../hooks/useOnline';
import { Alert, Box } from '@mui/material';

export const OnlineStatusIndicator = () => {
  const isOnline = useOnline();

  if (isOnline) {
    return null; // No mostrar nada cuando está online
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <Alert
        severity="warning"
        sx={{
          m: 0,
          borderRadius: 0,
          backgroundColor: '#ef4444',
          color: 'white',
          '& .MuiAlert-icon': {
            color: 'white',
          },
        }}
      >
        ⚠️ Sin conexión a internet. Los cambios se sincronizarán cuando se recupere la conexión.
      </Alert>
    </Box>
  );
};
