import React from 'react';
import { Chip } from '@mui/material';

type Props = { label: string; color?: 'default'|'primary'|'secondary'|'success'|'error'|'warning'|'info' };

const UiBadge: React.FC<Props> = ({ label, color = 'default' }) => (
  <Chip label={label} color={color as any} size="small" />
);

export default UiBadge;
