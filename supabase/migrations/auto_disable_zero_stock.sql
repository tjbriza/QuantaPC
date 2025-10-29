-- Migration: Auto-disable products with zero stock
-- This script will set is_disabled = true for all products that currently have stock_quantity = 0

UPDATE products 
SET is_disabled = true 
WHERE stock_quantity = 0 AND is_disabled = false;

-- Optional: You can also create a trigger to automatically disable products when stock becomes 0
-- This trigger will run on any UPDATE to the products table
CREATE OR REPLACE FUNCTION auto_disable_zero_stock_products()
RETURNS TRIGGER AS $$
BEGIN
    -- If stock_quantity becomes 0, automatically set is_disabled to true
    IF NEW.stock_quantity = 0 AND OLD.stock_quantity > 0 THEN
        NEW.is_disabled = true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_auto_disable_zero_stock ON products;
CREATE TRIGGER trigger_auto_disable_zero_stock
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION auto_disable_zero_stock_products();