-- Function to update user roles with superadmin validation
CREATE OR REPLACE FUNCTION update_user_role(
    target_user_id uuid,
    new_role text,
    actor_user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    actor_role text;
    target_current_role text;
    result_data json;
BEGIN
    -- Validate new role
    IF new_role NOT IN ('user', 'admin', 'superadmin') THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid role. Must be user, admin, or superadmin'
        );
    END IF;
    
    -- Get actor's role
    SELECT role INTO actor_role
    FROM profiles
    WHERE id = actor_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Actor user not found'
        );
    END IF;
    
    -- Only superadmin can change roles
    IF actor_role != 'superadmin' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only superadmin users can modify user roles'
        );
    END IF;
    
    -- Get target user's current role
    SELECT role INTO target_current_role
    FROM profiles
    WHERE id = target_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Target user not found'
        );
    END IF;
    
    -- Prevent superadmin from demoting themselves
    IF target_user_id = actor_user_id AND actor_role = 'superadmin' AND new_role != 'superadmin' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Superadmin cannot demote themselves'
        );
    END IF;
    
    -- Set the current user for the trigger
    PERFORM set_config('app.current_user_id', actor_user_id::text, true);
    
    -- Update the role
    UPDATE profiles
    SET role = new_role
    WHERE id = target_user_id;
    
    -- Clear the config
    PERFORM set_config('app.current_user_id', '', true);
    
    RETURN json_build_object(
        'success', true,
        'data', json_build_object(
            'target_user_id', target_user_id,
            'previous_role', target_current_role,
            'new_role', new_role,
            'updated_by', actor_user_id
        )
    );
    
EXCEPTION WHEN OTHERS THEN
    -- Clear the config on error
    PERFORM set_config('app.current_user_id', '', true);
    
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_user_role(uuid, text, uuid) TO authenticated;