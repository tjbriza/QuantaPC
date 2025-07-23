import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';

export default function About() {
  const { session } = useAuth();

  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  return (
    <>
      <h1>About Us</h1>
    </>
  );
}
