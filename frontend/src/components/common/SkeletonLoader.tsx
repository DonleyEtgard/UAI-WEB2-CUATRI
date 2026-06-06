import React from 'react';
import { Skeleton, Box } from '@mui/material';

type Props = { variant?: 'rect'|'text'|'circular'; height?: number; width?: number | string; count?: number };

const SkeletonLoader: React.FC<Props> = ({ variant = 'rect', height = 40, width = '100%', count = 3 }) => (
  <Box>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} variant={variant as any} height={height} width={width} sx={{ mb: 1 }} />
    ))}
  </Box>
);

export default SkeletonLoader;
