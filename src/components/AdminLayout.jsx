// src/components/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminNavigation from './admin/ui/AdminNavigation';

export default function AdminLayout() {
  return (
    <div>
      <AdminNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
