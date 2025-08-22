// src/hooks/useUsernameCheck.jsx
import { useState, useCallback, useEffect } from 'react';
import { useSupabaseRead } from './useSupabaseRead';
import { useDebounce } from './useDebounce';

export function useUsernameCheck(currentUserId = null) {
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameToCheck, setUsernameToCheck] = useState('');
  const [status, setStatus] = useState(''); // 'checking', 'available', 'taken', ''

  const { data, loading, error } = useSupabaseRead('profiles', {
    filter: { username: usernameToCheck },
    select: 'username, id',
    single: true,
    enabled: usernameToCheck.length >= 3,
  });

  // Debounced function to update usernameToCheck
  const [debouncedCheck] = useDebounce((newUsername) => {
    setUsernameToCheck(newUsername);
    setStatus('checking');
  }, 300);

  // Function to trigger username check from input
  const checkUsername = useCallback(
    (newUsername, originalUsername = null) => {
      setUsernameInput(newUsername);

      if (originalUsername && newUsername === originalUsername) {
        setStatus('');
        setUsernameToCheck(''); // Stop query
        return;
      }

      if (newUsername.length >= 3) {
        debouncedCheck(newUsername);
      } else {
        setStatus('');
        setUsernameToCheck('');
      }
    },
    [debouncedCheck]
  );

  // Update status based on query result
  useEffect(() => {
    if (loading) {
      setStatus('checking');
    } else if (error) {
      console.error('Username check error:', error);
      setStatus('');
    } else if (data) {
      if (currentUserId && data.id === currentUserId) {
        setStatus('available');
      } else {
        setStatus('taken');
      }
    } else if (!data && usernameToCheck.length >= 3) {
      setStatus('available');
    }
  }, [data, loading, error, currentUserId, usernameToCheck]);

  const clearStatus = useCallback(() => {
    setStatus('');
    setUsernameInput('');
    setUsernameToCheck('');
  }, []);

  return {
    username: usernameInput,
    status,
    isChecking: loading && usernameToCheck.length >= 3,
    checkUsername,
    clearStatus,
  };
}
