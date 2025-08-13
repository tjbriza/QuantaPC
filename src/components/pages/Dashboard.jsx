import { useState } from 'react';
import Navigation from '../ui/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { session } = useAuth();

  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  const userProfile = data || {};
  //check if user doesn't have a  (temporary check)
  if (!loading) {
    if (userProfile.name_first === undefined) {
      return <Navigate to='/profilesetup' replace />;
    }
  }

  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome, {session ? userProfile.name_first : 'not logged in'}!</p>
      <div>
        {userProfile.avatar_url ? (
          <img src={userProfile.avatar_url} />
        ) : (
          'no pic bro'
        )}
      </div>
    </>
  );
}
