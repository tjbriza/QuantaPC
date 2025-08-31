import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function AdminRoute({ children }) {
  const { session } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!session) {
        setIsChecking(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || profile?.role !== 'admin') {
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
