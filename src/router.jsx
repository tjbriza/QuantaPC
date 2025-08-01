import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import App from './App';
import Dashboard from './components/pages/Dashboard';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Catalog from './components/pages/Catalog';
import About from './components/pages/About';
import PrivateRoute from './components/PrivateRoute';
import ProfileSetup from './components/pages/ProfileSetup';
import ProductPage from './components/pages/ProductPage';
import ErrorPage from './components/pages/ErrorPage';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'about', element: <About /> },
      { path: 'product/:id', element: <ProductPage /> },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: 'profilesetup',
        element: (
          <PrivateRoute>
            <ProfileSetup />
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
]);
