// src/hooks/useUsernameCheck.jsx
import { useState, useCallback, useEffect } from 'react';
import { useSupabaseRead } from './useSupabaseRead';
import { useDebounce } from './useDebounce';

export function useUsernameCheck(currentUserId = null) {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(''); // 'checking', 'available', 'taken', ''
  const [enabled, setEnabled] = useState(false);

  const { data, loading, error } = useSupabaseRead('profiles', {
    filter: { username },
    select: 'username, id',
    single: true,
    enabled: enabled && username.length >= 3,
  });

  // Debounced function to trigger the check
  const [debouncedCheck] = useDebounce(() => {
    if (username && username.length >= 3) {
      setStatus('checking');
      setEnabled(true);
    } else {
      setStatus('');
      setEnabled(false);
    }
  }, 500);

  // Function to check username availability
  const checkUsername = useCallback(
    (newUsername, originalUsername = null) => {
      // Skip if username hasn't changed from original
      if (originalUsername && newUsername === originalUsername) {
        setStatus('');
        setEnabled(false);
        return;
      }

      setUsername(newUsername);
      debouncedCheck();
    },
    [debouncedCheck]
  );

  // Process the result when data changes
  useEffect(() => {
    if (!enabled) return;

    if (loading) {
      setStatus('checking');
    } else if (error) {
      if (error.code === 'PGRST116') {
        // No rows found - username is available
        setStatus('available');
      } else {
        setStatus('');
        console.error('Username check error:', error);
      }
    } else if (data) {
      // Username exists - check if it's the current user
      if (currentUserId && data.id === currentUserId) {
        setStatus('available'); // It's the current user's username
      } else {
        setStatus('taken');
      }
    }
  }, [data, loading, error, enabled, currentUserId]);

  const clearStatus = useCallback(() => {
    setStatus('');
    setEnabled(false);
    setUsername('');
  }, []);

  return {
    status,
    isChecking: loading && enabled,
    checkUsername,
    clearStatus,
  };
}
