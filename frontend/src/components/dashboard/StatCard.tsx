import { Card, Box, Typography, alpha } from '@mui/material';
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

export const StatCard = ({ title, value, icon, trend, color = '#6366f1' }: StatCardProps) => {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 4px 12px ${alpha(color, 0.1)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1, display: 'block' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: trend ? 1.5 : 0 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem', color: trend.direction === 'up' ? 'success.main' : 'error.main', fontWeight: 600 }}>
              <span>{trend.direction === 'up' ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>vs mes anterior</Typography>
            </Box>
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: alpha(color, 0.1),
              color: color,
              fontSize: '1.5rem',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
};
