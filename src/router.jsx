import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import App from './App';
import Dashboard from './components/pages/Dashboard';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'dashboard', element: <Dashboard /> },
    ],
  },
]);
