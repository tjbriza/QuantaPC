import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminTopbar({ onDrawerToggle }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color='inherit'
            edge='start'
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src='/favicon.png'
              alt='QuantaPC Logo'
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
              }}
            />
            <Typography variant='h6' noWrap component='div'>
              quantapc Admin Console
            </Typography>
          </Box>
        </div>

        <Button
          variant='outlined'
          startIcon={<Logout />}
          onClick={handleSignOut}
          sx={{
            color: 'black',
            borderColor: 'black',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: 'black',
            },
          }}
        >
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
