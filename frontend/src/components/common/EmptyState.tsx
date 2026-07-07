import React from 'react';
import { Box, Button, Typography, alpha } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Sin datos',
  description = 'No hay información para mostrar',
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 4,
        borderRadius: 4,
        border: '1px dashed',
        borderColor: 'divider',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          mb: 2,
        }}
      >
        <InboxOutlinedIcon sx={{ fontSize: '2rem' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 3, borderRadius: 2, px: 3 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;