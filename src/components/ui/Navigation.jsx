import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const { session, signOut } = useAuth();

  return (
    <nav className='flex gap-4 p-4'>
      <Link to='/'>Home</Link>
      {session ? (
        <>
          <Link to='/dashboard'>Dashboard</Link>
          <button onClick={signOut} className='cursor-pointer'>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to='/login'>Login</Link>
          <Link to='/signup'>Sign Up</Link>
        </>
      )}

      <p>Status: {session ? 'Logged in' : 'Logged out'}</p>
    </nav>
  );
}
