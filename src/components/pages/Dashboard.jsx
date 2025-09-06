import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { Navigate, Outlet } from 'react-router-dom';
import DashboardNavigation from '../ui/Dashboard/DashboardNavigation';

export default function Dashboard() {
  const { session } = useAuth();
  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  const userProfile = data || {};
  //check if user doesn't have a  (temporary check, should be replaced with a more robust check!11)
  if (!loading) {
    if (userProfile.name_first === undefined) {
      return <Navigate to='/profilesetup' replace />;
    }
  }

  return (
    <div className='flex items-center mt-10'>
      <div className='container mx-auto px-13'>
        <DashboardNavigation />
        <Outlet />
      </div>
    </div>
  );
}
