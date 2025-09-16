import { createBrowserRouter } from 'react-router-dom';

// User routes
import Layout from './components/Layout';
import App from './App';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Dashboard/Profile';
import Orders from './components/pages/Dashboard/Orders';
import OrderDetails from './components/pages/Dashboard/OrderDetails';
import DashboardServices from './components/pages/Dashboard/Services';
import ServiceDetails from './components/pages/Dashboard/ServiceDetails';
import Addresses from './components/pages/Dashboard/Addresses';
import Tracking from './components/pages/Dashboard/Tracking';
import Wishlist from './components/pages/Dashboard/Wishlist';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import Catalog from './components/pages/Catalog';
import About from './components/pages/About';
import Services from './components/pages/Services';
import ServiceRequestForm from './components/pages/ServiceRequestForm';
import CustomPc from './components/pages/CustomPc';
import PrivateRoute from './components/PrivateRoute';
import ProfileSetup from './components/pages/ProfileSetup';
import ProductPage from './components/pages/ProductPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderFailed from './components/pages/OrderFail';
import OrderSuccess from './components/pages/OrderSuccess';
import ServicePaymentSuccess from './components/pages/ServicePaymentSuccess';
import ServicePaymentFail from './components/pages/ServicePaymentFail';
import ErrorPage from './components/pages/ErrorPage';
import ResetPassword from './components/pages/ResetPassword';
import ForgotPassword from './components/pages/ForgotPassword';

import CustomerServiceLayout from './components/pages/CustomerService/CustomerServiceLayout';
import PaymentFAQs from './components/pages/CustomerService/PaymentFAQs';
import PrivacyPolicy from './components/pages/CustomerService/PrivacyPolicy';
import CancellationPolicy from './components/pages/CustomerService/CancellationPolicy';
import CookiePolicy from './components/pages/CustomerService/CookiePolicy';
import ReturnAndRefunds from './components/pages/CustomerService/ReturnAndRefunds';
import TermsAndConditions from './components/pages/CustomerService/TermsAndConditions';
import ContactUs from './components/pages/CustomerService/ContactUs';

// Admin routes
import AdminLayout from './components/AdminLayout';
import AdminLogin from './components/admin/pages/AdminLogin';
import AdminDashboard from './components/admin/pages/AdminDashboard';
import AdminProducts from './components/admin/pages/AdminProducts';
import AdminUsers from './components/admin/pages/AdminUsers';
import AdminOrders from './components/admin/pages/AdminOrders';
import AdminServices from './components/admin/pages/AdminServices';
import AdminSettings from './components/admin/pages/AdminSettings';
import AdminLogs from './components/admin/pages/AdminLogs';
import AdminRoute from './components/AdminRoute';

import ScrollToTop from './components/ui/ScrollToTop';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ScrollToTop>
        <Layout />
      </ScrollToTop>
    ),
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'forgotpassword', element: <ForgotPassword /> },
      { path: 'resetpassword', element: <ResetPassword /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'services/request', element: <ServiceRequestForm /> },
      { path: 'custom-pc', element: <CustomPc /> },
      { path: 'product/:id', element: <ProductPage /> },
      {
        path: 'CustomerService',
        element: <CustomerServiceLayout />,
        children: [
          { path: 'PaymentFaqs', element: <PaymentFAQs /> },
          { path: 'PrivacyPolicy', element: <PrivacyPolicy /> },
          { path: 'CancellationPolicy', element: <CancellationPolicy /> },
          { path: 'CookiePolicy', element: <CookiePolicy /> },
          { path: 'ReturnAndRefunds', element: <ReturnAndRefunds /> },
          { path: 'TermsAndConditions', element: <TermsAndConditions /> },
          { path: 'ContactUs', element: <ContactUs /> },
        ],
      },
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
          { path: 'orders/:orderNumber', element: <OrderDetails /> },
          { path: 'services', element: <DashboardServices /> },
          { path: 'services/:serviceNumber', element: <ServiceDetails /> },
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
      // Service payment success/failure (public so customers from email invoice can view)
      {
        path: 'services/:serviceNumber/success',
        element: <ServicePaymentSuccess />,
      },
      {
        path: 'services/:serviceNumber/failed',
        element: <ServicePaymentFail />,
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
        path: 'logs',
        element: (
          <AdminRoute>
            <AdminLogs />
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
