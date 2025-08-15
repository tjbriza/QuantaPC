import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './ui/Navigation';
import Footer from './ui/Footer';

export default function Layout() {
  const location = useLocation();

  // Hide navigation on login, signup, dashboard, and profilesetup pages
  const hideNavigation =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/profilesetup';

  return (
    <>
      {!hideNavigation && <Navigation />}

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
