import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

type LoaderProps = {
  text?: string;
  fullScreen?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ text = 'Cargando...', fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight: fullScreen ? '100vh' : 220,
      }}
    >
      <CircularProgress thickness={4} size={38} />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Box>
  );
};

export default Loader;