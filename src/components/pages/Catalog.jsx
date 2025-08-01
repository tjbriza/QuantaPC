import { useState } from 'react';
import Navigation from '../ui/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';
import Background from '../ui/Background.jsx';
import Content from '../ui/HomeContent.jsx';
export default function Catalog() {
  const { session } = useAuth();

  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  return (
    <div className='min-h-screen bg-black'>
      <Background />
    </div>
  );
}
