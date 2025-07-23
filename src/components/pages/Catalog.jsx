import { useState } from 'react';
import Navigation from '../ui/Navigation';
import { useAuth } from '../../context/AuthContext';
import { useSupabaseRead } from '../../hooks/useSupabaseRead';

export default function Catalog() {
  const { session } = useAuth();

  const { data, error, loading } = useSupabaseRead('profiles', {
    filter: { id: session?.user.id },
    single: true,
  });

  return (
    <>
      <h1>Product Catalog</h1>
    </>
  );
}
