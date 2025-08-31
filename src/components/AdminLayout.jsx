// src/components/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminNavigation from './admin/ui/AdminNavigation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const adminTheme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

export default function AdminLayout() {
  return (
    <ThemeProvider theme={adminTheme}>
      <div className='min-h-screen bg-gray-50'>
        <AdminNavigation />
        <main className='flex-1'>
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  );
}
