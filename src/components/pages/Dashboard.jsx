import { useState } from 'react';
import Navigation from '../ui/Navigation';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { session } = useAuth();
  return (
    <>
      <h1>Dashboard</h1>
      <p>welcome {session ? session.user.email : 'not logged in'}</p>
    </>
  );
}
