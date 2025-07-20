import { useState } from 'react';
import Navigation from '../ui/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';

export default function Dashboard() {
  const { session } = useAuth();

  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  const userProfile = data || {};

  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome, {session ? userProfile.name_first : 'not logged in'}!</p>
    </>
  );
}
