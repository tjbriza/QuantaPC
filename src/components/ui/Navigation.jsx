import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className='flex gap-4 p-4'>
      <Link to='/'>Home</Link>
      <Link to='/login'>Login</Link>
      <Link to='/signup'>Sign Up</Link>
      <Link to='/dashboard'>Dashboard</Link>
    </nav>
  );
}
