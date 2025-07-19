import { Outlet } from 'react-router-dom';
import Navigation from './ui/Navigation';

export default function Layout() {
  return (
    <>
      <Navigation />

      <main>
        <Outlet />
      </main>
    </>
  );
}
