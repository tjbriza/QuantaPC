import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, CssBaseline } from '@mui/material';
import AdminTopbar from './admin/ui/AdminTopbar';
import AdminNavigation from './admin/ui/AdminNavigation';
import AdminContent from './admin/ui/AdminContent';
import adminTheme from './theme/adminTheme';

export default function AdminLayout() {
  const { session } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (!session) {
      setIsChecking(false);
      setIsAdmin(false);
      return;
    }

    const checkAdminRole = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || profile?.role !== 'admin') {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminRole();
  }, [session]);

  // hide nav on login page
  const shouldShowNavigation =
    isAdmin && !isChecking && location.pathname !== '/admin';

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: shouldShowNavigation ? 'flex' : 'block' }}>
        <CssBaseline />

        {shouldShowNavigation && (
          <>
            <AdminTopbar onDrawerToggle={handleDrawerToggle} />
            <AdminNavigation
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
            />
            <AdminContent>
              <Outlet />
            </AdminContent>
          </>
        )}

        {!shouldShowNavigation && <Outlet />}
      </Box>
    </ThemeProvider>
  );
}
