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
      {children}
    </Box>
  );
}
