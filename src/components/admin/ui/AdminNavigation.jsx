import React from 'react';
import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBasket,
  Bolt,
  ClipboardPen,
} from 'lucide-react';
const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <LayoutDashboard />, path: '/admin/dashboard' },
  { text: 'Users', icon: <Users />, path: '/admin/users' },
  { text: 'Products', icon: <Package />, path: '/admin/products' },
  { text: 'Orders', icon: <ShoppingBasket />, path: '/admin/orders' },
  { text: 'Services', icon: <ClipboardPen />, path: '/admin/services' },
  { text: 'Settings', icon: <Bolt />, path: '/admin/settings' },
];

export default function AdminNavigation({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <List sx={{ py: 0 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              py: 1,
              my: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderLeft: '4px solid #000000',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, mr: 1 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component='nav'
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <Drawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            position: 'fixed',
            top: 0,
            left: 0,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant='permanent'
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            position: 'fixed',
            top: 0,
            left: 0,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
