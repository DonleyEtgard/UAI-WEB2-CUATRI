import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider } from "@mui/material";

type NavbarProps = {
  title?: string;
  onToggleSidebar?: () => void;
  onLogout?: () => Promise<void>;
  Name?: string;
};

const Navbar: React.FC<NavbarProps> = ({
  title = "Dashboard",
  onToggleSidebar,
  onLogout,
  Name = "Admin",
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 2, lg: 3 } }}>
        {/* LEFT AREA: Sidebar Toggle & Title */}
        {onToggleSidebar && (
          <IconButton
            onClick={onToggleSidebar}
            edge="start"
            color="inherit"
            aria-label="Toggle sidebar"
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            ☰
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Typography variant="h6" noWrap component="h1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main', boxShadow: (theme) => `0 0 8px ${theme.palette.success.main}` }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Sistema Online
            </Typography>
          </Box>
        </Box>

        {/* RIGHT AREA */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
          <LanguageSelector />

          {/* USER MENU */}
          <Box>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                {Name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              slotProps={{ paper: { sx: { mt: 1.5, width: 240, borderRadius: 2 } } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="caption" color="text.secondary">Sesión iniciada como</Typography>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 'bold' }}>{user?.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { handleClose(); onLogout?.(); }}>
                <Typography color="error">🚪 {t("navigation.navbar.logout")}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;