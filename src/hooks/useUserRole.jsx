import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export function useUserRole() {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setUserRole(null);
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        setUserRole(data?.role || 'user');
        setError(null);
      } catch (err) {
        console.error('Error fetching user role:', err);
        setError(err);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [session?.user?.id]);

  const isSuperAdmin = userRole === 'superadmin';
  const isAdmin = userRole === 'admin' || isSuperAdmin;
  const isUser = userRole === 'user';

  const canModifyRoles = isSuperAdmin;
  const canAccessAdmin = isAdmin;

  return {
    userRole,
    isLoading,
    error,
    isSuperAdmin,
    isAdmin,
    isUser,
    canModifyRoles,
    canAccessAdmin,
  };
}
