import React from 'react';
import { Box, Skeleton } from '@mui/material';

type Props = { variant?: 'rect' | 'text' | 'circular'; height?: number; width?: number | string; count?: number };

const SkeletonLoader: React.FC<Props> = ({ variant = 'rect', height = 40, width = '100%', count = 3 }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        variant={variant as any}
        height={height}
        width={width}        
        sx={{ borderRadius: 2, bgcolor: 'action.hover' }}
      />
    ))}
  </Box>
);

export default SkeletonLoader;
