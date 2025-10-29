-- Add is_disabled column to products table if it doesn't exist
-- This migration ensures the products table has the is_disabled column
-- needed for stock management functionality

-- Add the column if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_disabled boolean NOT NULL DEFAULT false;

-- Update any existing products with zero stock to be disabled
UPDATE products 
SET is_disabled = true 
WHERE stock_quantity = 0 AND is_disabled = false;