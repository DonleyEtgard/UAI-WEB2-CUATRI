import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import type { SxProps } from "@mui/material/styles";

type Props = React.PropsWithChildren<{ title?: string; action?: React.ReactNode; sx?: SxProps }>

const UiCard: React.FC<Props> = ({ title, action, children, sx }) => (
  <Card sx={{ borderRadius: 2, boxShadow: 3, ...((sx as any) ?? {}) }}>
    {title && <CardHeader title={title} action={action} sx={{ pb: 0 }} />}
    <CardContent>{children}</CardContent>
  </Card>
);

export default UiCard;
