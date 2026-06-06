import React from 'react';
import { Box } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

type Props = {
  rows: any[];
  columns: GridColDef[];
  loading?: boolean;
  autoHeight?: boolean;
  pageSize?: number;
  onRowClick?: (params: any) => void;
};

const DataGridWrapper: React.FC<Props> = ({ rows, columns, loading = false, autoHeight = true, pageSize = 10, onRowClick }) => (
  <Box sx={{ height: autoHeight ? 'auto' : 400, width: '100%' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      loading={loading}
      autoHeight={autoHeight}
      pageSizeOptions={[pageSize]}
      disableRowSelectionOnClick
      onRowClick={onRowClick}
      density="compact"
    />
  </Box>
);

export default DataGridWrapper;
