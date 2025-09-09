import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './ui/Navigation';
import Footer from './ui/Footer';
import Background from './ui/Background';
import MainBackground from './ui/MainBackground';

export default function Layout() {
  const location = useLocation();

  // Hide navigation on login, signup, dashboard, and profilesetup pages
  const hideNavigation =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/profilesetup' ||
    location.pathname === '/forgotpassword' ||
    location.pathname === '/resetpassword';

  // Hide footer on login, signup, and profilesetup pages
  const hideFooter =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/profilesetup' ||
    location.pathname === '/forgotpassword' ||
    location.pathname === '/resetpassword';

  // Show special background on homepage, signup, login, and profilesetup pages
  const showBackground =
    location.pathname === '/' ||
    location.pathname === '/signup' ||
    location.pathname === '/login' ||
    location.pathname === '/profilesetup' ||
    location.pathname === '/forgotpassword' ||
    location.pathname === '/resetpassword';

  // Show main background on all other pages
  const showMainBackground = !showBackground;

  const content = (
    <>
      {!hideNavigation && <Navigation />}

      <main>
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </>
  );

  if (showBackground) {
    return <Background>{content}</Background>;
  } else if (showMainBackground) {
    return <MainBackground>{content}</MainBackground>;
  } else {
    return content;
  }
}
