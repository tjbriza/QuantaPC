-- Migration script to create the first superadmin user
-- This should be run manually by the database administrator

-- First, let's see if there are any existing admin users
-- Run this query to find admin users:
-- SELECT id, name_first, name_last, username, email, role FROM profiles WHERE role = 'admin' ORDER BY created_at ASC;

-- To promote the first admin to superadmin, replace {ADMIN_USER_ID} with the actual user ID:
-- UPDATE profiles SET role = 'superadmin' WHERE id = '{ADMIN_USER_ID}';

-- Example usage:
-- 1. Find the first admin user
-- 2. Copy their user ID
-- 3. Run: UPDATE profiles SET role = 'superadmin' WHERE id = 'your-admin-user-id-here';

-- Verify the change:
-- SELECT id, name_first, name_last, username, email, role FROM profiles WHERE role = 'superadmin';

-- Important notes:
-- 1. Only promote one user to superadmin initially
-- 2. This user will then be able to promote/demote other users via the admin interface
-- 3. Superadmin users cannot demote themselves (safety feature)
-- 4. The superadmin role has exclusive permission to modify user roles