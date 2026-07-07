import React from 'react';
import { Card, CardContent, CardHeader, alpha } from '@mui/material';
import type { SxProps } from '@mui/material/styles';

type Props = React.PropsWithChildren<{ title?: string; action?: React.ReactNode; sx?: SxProps }>;

const UiCard: React.FC<Props> = ({ title, action, children, sx }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 4, // 16px
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
      bgcolor: 'background.paper',
      overflow: 'hidden',
      ...((sx as any) ?? {}),
    }}
  >
    {title && (
      <CardHeader
        sx={{ p: { xs: 2, md: 3 }, pb: 1.5 }}
        title={title}
        action={action}
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 600,
        }}
      />
    )}
    <CardContent sx={{ p: { xs: 2, md: 3 }, pt: title ? 1.5 : undefined }}>{children}</CardContent>
  </Card>
);

export default UiCard;
