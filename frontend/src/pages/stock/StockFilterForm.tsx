import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

type Props = {
  onFilter: (productId?: string) => void;
  onReload?: () => void;
};

export default function StockFilterForm({
  onFilter
}: Props) {
  const [productId, setProductId] = useState("");

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      alignItems: 'center',
      flexDirection: { xs: 'column', sm: 'row' },
      width: '100%'
    }}>
      <TextField
        placeholder="Buscar por ID de producto..."
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        fullWidth
        size="small"
        sx={{ 
          maxWidth: { sm: 400 },
          '& .MuiOutlinedInput-root': { 
            color: 'white', 
            bgcolor: '#0f1115', 
            borderRadius: 3,
            '& fieldset': { borderColor: '#2b2d31' }
          }
        }}
      />
      <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
        <Button 
          variant="contained" 
          onClick={() => onFilter(productId)}
          sx={{ bgcolor: '#6366f1', borderRadius: 2, fontWeight: 700, px: 3 }}
        >
          Filtrar
        </Button>
        <Button 
          variant="text" 
          onClick={() => { setProductId(""); onFilter(); }}
          sx={{ color: '#9ca3af' }}
        >
          Limpiar
        </Button>
      </Box>
    </Box>
  );
}