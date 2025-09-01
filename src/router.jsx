import { createBrowserRouter } from 'react-router-dom';

// User routes
import Layout from './components/Layout';
import App from './App';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Dashboard/Profile';
import Orders from './components/pages/Dashboard/Orders';
import Addresses from './components/pages/Dashboard/Addresses';
import Tracking from './components/pages/Dashboard/Tracking';
import Wishlist from './components/pages/Dashboard/Wishlist';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Catalog from './components/pages/Catalog';
import About from './components/pages/About';
import Services from './components/pages/Services';
import CustomPc from './components/pages/CustomPc';
import PrivateRoute from './components/PrivateRoute';
import ProfileSetup from './components/pages/ProfileSetup';
import ProductPage from './components/pages/ProductPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderFailed from './components/pages/OrderFail';
import OrderSuccess from './components/pages/OrderSuccess';
import ErrorPage from './components/pages/ErrorPage';

// Admin routes
import AdminLayout from './components/AdminLayout';
import AdminLogin from './components/admin/pages/AdminLogin';
import AdminDashboard from './components/admin/pages/AdminDashboard';
import AdminProducts from './components/admin/pages/AdminProducts';
import AdminUsers from './components/admin/pages/AdminUsers';
import AdminOrders from './components/admin/pages/AdminOrders';
import AdminServices from './components/admin/pages/AdminServices';
import AdminSettings from './components/admin/pages/AdminSettings';
import AdminRoute from './components/AdminRoute';

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
      { path: 'services', element: <Services /> },
      { path: 'custom-pc', element: <CustomPc /> },
      { path: 'product/:id', element: <ProductPage /> },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Profile /> },
          { path: 'profile', element: <Profile /> },
          { path: 'orders', element: <Orders /> },
          { path: 'addresses', element: <Addresses /> },
          { path: 'tracking', element: <Tracking /> },
          { path: 'wishlist', element: <Wishlist /> },
        ],
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
        path: 'cart',
        element: (
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: 'orders/:orderNumber/success',
        element: (
          <PrivateRoute>
            <OrderSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: 'orders/:orderNumber/failed',
        element: (
          <PrivateRoute>
            <OrderFailed />
          </PrivateRoute>
        ),
      },
      { path: '*', element: <ErrorPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminLogin /> }, // Unprotected login
      {
        path: 'dashboard',
        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        ),
      },
      {
        path: 'services',
        element: (
          <AdminRoute>
            <AdminServices />
          </AdminRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        ),
      },
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);
