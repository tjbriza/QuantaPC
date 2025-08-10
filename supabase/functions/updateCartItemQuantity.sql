create function updateCartItemQuantity(p_user_id uuid, p_product_id uuid, p_quantity int)
returns json
language plpgsql
as $$
declare
    v_cart_id uuid;
    v_stock int;
    v_final_quantity int;
    v_quantity_adjusted boolean;
begin
    if p_quantity <= 0 then
        return json_build_object('success', false, 'message', 'Quantity must be greater than zero');
    end if;

    --get user's cart
    select id into v_cart_id
    from carts
    where user_id = p_user_id;

    if v_cart_id is null then
        return json_build_object('success', false, 'message', 'Cart not found for user');
    end if;

    --get product stock
    select stock into v_stock
    from products
    where id = p_product_id;

    if not found then
        return json_build_object('success', false, 'message', 'Product not found');
    end if;

    --clamp quantity to available stock (to prevent overordering)
    v_final_quantity := LEAST(p_quantity, v_stock);
    v_quantity_adjusted := (p_quantity > v_stock);

    update cart_items
    set quantity = v_final_quantity
    where cart_id = v_cart_id and product_id = p_product_id;

    if not found then
        return json_build_object('success', false, 'message', 'Cart item not found');
    end if;
    
    return json_build_object('success', true, 'final_quantity', v_final_quantity, 'quantity_adjusted', v_quantity_adjusted);
end;
$$