create function updateProductStock(
    p_product_id uuid,
    p_quantity int,
    p_operation text default 'subtract'
)
returns json
language plpgsql
as $
declare
    v_current_stock int;
    v_new_stock int;
begin
    --check for quantity
    if p_quantity <= 0 then
        return json_build_object('success', false, 'message', 'Quantity must be greater than zero');
    end if;
    
    --get current stock
    select stock_quantity into v_current_stock
    from products
    where id = p_product_id;

    if not found then
        return json_build_object('success', false, 'message', 'Product not found');
    end if;

    --calculate new stock based on operation
    if p_operation = 'subtract' then
        v_new_stock := v_current_stock - p_quantity;
    elsif p_operation = 'add' then
        v_new_stock := v_current_stock + p_quantity;
    else
        return json_build_object('success', false, 'message', 'Invalid operation');
    end if;

    --prevent negative stock
    if v_new_stock < 0 then
        return json_build_object('success', false, 'message', 'Insufficient stock');
    end if;

    --update stock
    update products
    set stock_quantity = v_new_stock
    where id = p_product_id;

    return json_build_object('success', true, 'old_stock', v_current_stock, 'new_stock', v_new_stock);
end
$