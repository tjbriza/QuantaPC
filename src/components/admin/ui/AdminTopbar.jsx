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

  const handleSkipToContent = () => {
    const mainContent = document.getElementById('admin-main-content');
    if (mainContent) {
      // find the first focusable element within the main content
      const focusableSelectors = [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ];

      const focusableElements = mainContent.querySelectorAll(
        focusableSelectors.join(', '),
      );

      if (focusableElements.length > 0) {
        // focus on the first focusable element
        focusableElements[0].focus();
        focusableElements[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else {
        // fallback to focusing the main content container
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Button
        onClick={handleSkipToContent}
        aria-label='Skip to main content'
        sx={{
          position: 'absolute',
          top: -100,
          left: 8,
          zIndex: 9999,
          backgroundColor: 'primary.main',
          color: 'white',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 600,
          borderRadius: 1,
          boxShadow: 3,
          textTransform: 'none',
          '&:focus': {
            top: 8,
            transform: 'none',
          },
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          '&:focus:hover': {
            backgroundColor: 'primary.dark',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Skip to Content
      </Button>

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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            >
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
                <Typography
                  variant='h6'
                  fontWeight={800}
                  noWrap
                  component='div'
                >
                  quantapc
                </Typography>
              </Box>
              <Typography>admin console</Typography>
            </Box>
          </div>

          <Button
            variant='outlined'
            startIcon={<Logout />}
            onClick={handleSignOut}
            sx={{
              color: 'black',
              borderColor: 'black',
              borderRadius: 4,
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
    </>
  );
}
