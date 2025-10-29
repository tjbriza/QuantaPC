-- Add superadmin role to the existing role constraint
-- First, update the profiles table to allow 'superadmin' role
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('user', 'admin', 'superadmin'));

-- Create a function to check if a user can modify roles
CREATE OR REPLACE FUNCTION can_modify_roles(actor_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    actor_role text;
BEGIN
    -- Get the actor's role
    SELECT role INTO actor_role
    FROM profiles
    WHERE id = actor_user_id;
    
    -- Only superadmin can modify roles
    RETURN actor_role = 'superadmin';
END;
$$;

-- Create a function to enforce role change restrictions
CREATE OR REPLACE FUNCTION enforce_role_change_restrictions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    actor_user_id uuid;
    actor_role text;
    old_role text;
    new_role text;
BEGIN
    -- Get the current user (should be set by RLS or application)
    actor_user_id := current_setting('app.current_user_id', true)::uuid;
    
    -- If no actor is set, deny the operation
    IF actor_user_id IS NULL THEN
        RAISE EXCEPTION 'Role changes must be performed by an authenticated user';
    END IF;
    
    -- Get actor's role
    SELECT role INTO actor_role
    FROM profiles
    WHERE id = actor_user_id;
    
    -- Get old and new roles
    old_role := OLD.role;
    new_role := NEW.role;
    
    -- If role hasn't changed, allow the operation
    IF old_role = new_role THEN
        RETURN NEW;
    END IF;
    
    -- Only superadmin can change roles
    IF actor_role != 'superadmin' THEN
        RAISE EXCEPTION 'Only superadmin users can modify user roles';
    END IF;
    
    -- Prevent superadmin from demoting themselves
    IF OLD.id = actor_user_id AND old_role = 'superadmin' AND new_role != 'superadmin' THEN
        RAISE EXCEPTION 'Superadmin cannot demote themselves';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create the trigger for role change enforcement
DROP TRIGGER IF EXISTS trigger_enforce_role_changes ON profiles;
CREATE TRIGGER trigger_enforce_role_changes
    BEFORE UPDATE OF role ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION enforce_role_change_restrictions();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION can_modify_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION enforce_role_change_restrictions() TO authenticated;