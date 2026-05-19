import { Menu, Notifications, AccountCircle, Search } from "@mui/icons-material";
import { IconButton, Badge, InputBase, Box } from "@mui/material";

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        <IconButton onClick={onToggleSidebar} className="md:hidden text-on-surface">
          <Menu />
        </IconButton>
        
        <Box className="hidden sm:flex items-center bg-surface-container-high/50 rounded-full px-4 py-1 border border-outline-variant/50">
          <Search className="text-on-surface-variant text-sm" />
          <InputBase
            placeholder="Buscar..."
            className="ml-2 text-on-surface text-sm"
            sx={{ width: 200 }}
          />
        </Box>
      </div>

      <div className="flex items-center gap-2">
        <IconButton className="text-on-surface-variant">
          <Badge badgeContent={4} color="error" overlap="circular">
            <Notifications fontSize="small" />
          </Badge>
        </IconButton>
        
        <div className="h-8 w-[1px] bg-outline-variant mx-2" />
        
        <IconButton className="text-primary">
          <AccountCircle />
        </IconButton>
      </div>
    </header>
  );
};

export default Navbar;