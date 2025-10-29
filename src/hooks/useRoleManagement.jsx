import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function useRoleManagement() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { session } = useAuth();
  const { toast } = useToast();

  const updateUserRole = async (targetUserId, newRole) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to perform this action');
      return { success: false, error: 'Not authenticated' };
    }

    setIsUpdating(true);

    try {
      const { data, error } = await supabase.rpc('update_user_role', {
        target_user_id: targetUserId,
        new_role: newRole,
        actor_user_id: session.user.id,
      });

      if (error) {
        console.error('Role update error:', error);
        toast.error(error.message || 'Failed to update user role');
        return { success: false, error: error.message };
      }

      if (!data?.success) {
        const errorMsg = data?.error || 'Failed to update user role';
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      toast.success(`User role updated to ${newRole} successfully`);
      return { success: true, data: data.data };
    } catch (err) {
      console.error('Unexpected error updating role:', err);
      toast.error('An unexpected error occurred');
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUserRole,
    isUpdating,
  };
}
