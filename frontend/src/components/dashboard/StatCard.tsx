import { Card, Box, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export const StatCard = ({
  title,
  value,
  icon,
  color = '#6366f1',
  trend,
}: StatCardProps) => {


  return (
    <Card
      sx={{
        p: 3,
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        boxShadow: 'none',
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: '#9ca3af',
              fontWeight: 500,
              mb: 1,
              fontSize: '0.875rem',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#e4e2e4',
              fontSize: '1.875rem',
              mb: trend ? 1 : 0,
            }}
          >
            {value}
          </Typography>
          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.75rem',
                color: trend.direction === 'up' ? '#10b981' : '#ef4444',
              }}
            >
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% vs mes anterior</span>
            </Box>
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              backgroundColor: `${color}20`,
              fontSize: '1.5rem',
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
};
