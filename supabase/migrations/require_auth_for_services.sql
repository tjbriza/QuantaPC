-- Migration: Require authentication for service requests
-- This script makes user_id required for all service requests

-- First, handle any existing service requests with null user_id
-- (Optional: delete them or assign to a default user if needed)
-- For now, we'll just make the constraint

-- Make user_id NOT NULL - new service requests must have a valid user
ALTER TABLE service_requests 
ALTER COLUMN user_id SET NOT NULL;

-- Update the foreign key constraint to cascade delete
-- (when a user is deleted, their service requests are deleted too)
ALTER TABLE service_requests 
DROP CONSTRAINT IF EXISTS service_requests_user_id_fkey,
ADD CONSTRAINT service_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;