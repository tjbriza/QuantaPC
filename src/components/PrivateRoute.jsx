import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { session } = useAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <>{session ? <>{children}</> : <Navigate to='/login' />}</>;
};

export default PrivateRoute;
