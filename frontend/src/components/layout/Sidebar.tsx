import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, useTheme, useMediaQuery } from "@mui/material";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
};

const drawerWidth = 280;
const drawerCollapsedWidth = 80;

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const navItems = [
    { to: "/app/dashboard", icon: "🏠", label: t("navigation.sidebar.dashboard"), end: true },
    { to: "/app/sales", icon: "🧾", label: t("navigation.sidebar.sales") },
    { to: "/app/products", icon: "📦", label: t("navigation.sidebar.products") },
    { to: "/app/customers", icon: "👥", label: t("navigation.sidebar.customers") },
    { to: "/app/stock", icon: "📊", label: t("navigation.sidebar.stock") },
  ];

  const adminItems = [
    { to: "/app/users", icon: "👤", label: t("navigation.sidebar.users") },
    { to: "/app/users/roles", icon: "🔐", label: t("navigation.sidebar.roles") },
    { to: "/app/audit-log", icon: "📋", label: t("navigation.sidebar.audit") },
    { to: "/app/reports/sales", icon: "📈", label: t("navigation.sidebar.reports") },
    { to: "/app/subscription", icon: "💳", label: t("navigation.sidebar.subscription") },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
      {/* HEADER */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 1, gap: isOpen ? 2 : 0, justifyContent: isOpen ? 'flex-start' : 'center' }}>
        <Box sx={{
          width: 40, height: 40, borderRadius: 2,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Typography variant="h6">⚡</Typography>
        </Box>
        {isOpen && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>HAITIBIZ ERP</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>Dashboard</Typography>
          </Box>
        )}
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, mt: 1 }}>
        {isOpen && <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>Menú Principal</Typography>}
        {navItems.map(item => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              end={item.end}
              onClick={onClose}
              sx={{
                justifyContent: isOpen ? 'initial' : 'center',
                px: 2.5,
                my: 0.5,
                borderRadius: 2,
                '&.active': {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': { color: 'primary.main' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 3 : 'auto', justifyContent: 'center', fontSize: '1.25rem' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ opacity: isOpen ? 1 : 0, '& .MuiTypography-root': { fontWeight: 'bold' } }} />
            </ListItemButton>
          </ListItem>
        ))}

        {(user?.role === "admin" || user?.role === "superadmin") && (
          <>
            <Divider sx={{ my: 2 }} />
            {isOpen && <Typography variant="caption" sx={{ px: 2, color: 'text.secondary', fontWeight: 'bold' }}>Sistema</Typography>}
            {adminItems.map(item => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  onClick={onClose}
                  sx={{
                    justifyContent: isOpen ? 'initial' : 'center',
                    px: 2.5,
                    my: 0.5,
                    borderRadius: 2,
                    '&.active': { bgcolor: 'action.selected', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 3 : 'auto', justifyContent: 'center', fontSize: '1.25rem' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} sx={{ opacity: isOpen ? 1 : 0, '& .MuiTypography-root': { fontWeight: 'bold' } }} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>

      {/* FOOTER */}
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={onLogout}
            sx={{
              justifyContent: isOpen ? 'initial' : 'center',
              px: 2.5,
              borderRadius: 2,
              color: 'error.main',
              '&:hover': { bgcolor: 'error.lighter' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isOpen ? 3 : 'auto', justifyContent: 'center', color: 'inherit', fontSize: '1.25rem' }}>🚪</ListItemIcon>
            <ListItemText primary={t("navigation.sidebar.logout")} sx={{ opacity: isOpen ? 1 : 0, '& .MuiTypography-root': { fontWeight: 'bold' } }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: isOpen ? drawerWidth : drawerCollapsedWidth }, flexShrink: { md: 0 }, transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }) }}
    >
      {isDesktop ? (
        <Drawer
          variant="permanent"
          open={isOpen}
          sx={{
            '& .MuiDrawer-paper': {
              width: isOpen ? drawerWidth : drawerCollapsedWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;