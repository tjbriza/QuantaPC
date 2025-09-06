import React from 'react';
import { Box, Toolbar } from '@mui/material';

const drawerWidth = 240;

export default function AdminContent({ children }) {
  return (
    <Box
      component='main'
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        marginLeft: { sm: `${drawerWidth}px` },
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Box
        id='admin-main-content'
        tabIndex={-1}
        sx={{
          outline: 'none',
          '&:focus': {
            outline: '2px solid #1976d2',
            outlineOffset: '4px',
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
