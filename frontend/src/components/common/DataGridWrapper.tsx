import React from 'react';
import { Box, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

type Props = {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  autoHeight?: boolean;
  pageSize?: number;
  onRowClick?: (params: any) => void;
};

const DataGridWrapper: React.FC<Props> = ({ rows, columns, loading = false, autoHeight = true, pageSize = 10, onRowClick }) => (
  <Box sx={{ height: autoHeight ? 'auto' : 600, width: '100%' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      autoHeight={autoHeight}
      pageSizeOptions={[pageSize]}
      disableRowSelectionOnClick={!onRowClick}
      onRowClick={onRowClick}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 4,
        bgcolor: 'background.paper',
        '--DataGrid-containerBackground': 'var(--mui-palette-background-paper, #fff)',
        '& .MuiDataGrid-columnHeaders': {
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 600,
          color: 'text.primary',
          fontSize: '0.875rem',
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
          cursor: onRowClick ? 'pointer' : 'default',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid',
          borderColor: 'divider',
        },
      }}
    />
  </Box>
);

export default DataGridWrapper;