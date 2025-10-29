import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { useState, useEffect } from 'react';
export default function AdminRoute({ children }) {
  const { session } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!session) {
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    const checkAdminRole = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (
          error ||
          (profile?.role !== 'admin' && profile?.role !== 'superadmin')
        ) {
          await supabase.auth.signOut();
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        await supabase.auth.signOut();
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminRole();
  }, [session]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!session || !isAdmin) {
    return <Navigate to='/admin' replace />;
  }

  return children;
}
