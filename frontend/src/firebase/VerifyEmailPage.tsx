import { useNavigate } from "react-router-dom";
import { useEmailVerification } from "./useEmailVerification";
import { Box, Paper, Typography, Button, CircularProgress, Alert } from "@mui/material";

const VerifyEmailPage = () => {
  const { resendEmail, checkStatus, loading, message } = useEmailVerification();
  const navigate = useNavigate();

  const handleVerified = async () => {
    const isVerified = await checkStatus();
    if (isVerified) {
      navigate("/app/dashboard");
    } else {
      // Se mantiene el alert, pero se podría reemplazar por un modal si existiera.
      alert(
        "Tu correo aún no ha sido verificado. Por favor, revisa tu bandeja de entrada (y la carpeta de spam)."
      );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={6} sx={{ maxWidth: 480, width: '100%', p: 4, textAlign: 'center', borderRadius: 4 }}>
        <Box sx={{
          mx: 'auto',
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.lighter',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}>
          <Typography variant="h4">✉️</Typography>
        </Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Verifica tu dirección de correo
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Hemos enviado un enlace de verificación a tu correo. Por favor, haz
          clic en él para activar tu cuenta y empezar a usar la plataforma.
        </Typography>

        {message && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Button
            fullWidth
            onClick={handleVerified}
            variant="contained"
            size="large"
          >
            Ya verifiqué mi correo
          </Button>

          <Button
            fullWidth
            onClick={resendEmail}
            disabled={loading}
            variant="text"
          >
            {loading ? <CircularProgress size={24} /> : "Reenviar correo de verificación"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;