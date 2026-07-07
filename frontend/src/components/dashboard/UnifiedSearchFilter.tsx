import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

interface FilterProps {
  onSearch: (filters: any) => void;
}

const UnifiedSearchFilter: React.FC<FilterProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ searchQuery, category, dateFrom, dateTo });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider', mb: 4 }}>
      <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <FilterAltOutlinedIcon color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Buscar y filtrar
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 0.7fr' }, gap: 2 }}>
          <TextField
            label="¿Qué estás buscando?"
            placeholder="Buscar por nombre, SKU, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
          <FormControl fullWidth>
            <InputLabel>Módulo</InputLabel>
            <Select label="Módulo" value={category} onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="all">Todos los registros</MenuItem>
              <MenuItem value="clients">Clientes</MenuItem>
              <MenuItem value="products">Productos</MenuItem>
              <MenuItem value="sales">Ventas / Facturas</MenuItem>
              <MenuItem value="users">Usuarios del Sistema</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Desde"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button type="submit" variant="contained" sx={{ borderRadius: 999 }}>
            Aplicar filtros
          </Button>
          <Button type="button" variant="outlined" onClick={clearFilters} sx={{ borderRadius: 999 }}>
            Limpiar
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UnifiedSearchFilter;