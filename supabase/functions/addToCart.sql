create function add_to_cart (p_user_id uuid, p_product_id uuid, p_quantity int)
returns json
language plpgsql
as $$
declare
    v_cart_id uuid;
    v_existing_quantity int;
    v_stock int;
    v_final_quantity int;
begin
    -- reject bad input
    if p_quantity <= 0 then
        raise exception 'Quantity must be greater than zero';
    end if;
    
    --get product stock
    select stock_quantity into v_stock
    from products
    where id = p_product_id;

    if not found then
        return json_build_object('success', false, 'message', 'Product not found');
    end if;

    if v_stock <= 0 then
        return json_build_object('success', false, 'message', 'Product is out of stock');
    end if;

    --get/create cart
    select id into v_cart_id
    from carts
    where user_id = p_user_id;

    if v_cart_id is null then
        insert into carts (user_id)
        values (p_user_id)
        returning id into v_cart_id;
    end if;

    -- check if product already exists in user's cart
    select quantity into v_existing_quantity
    from cart_items
    where cart_id = v_cart_id and product_id = p_product_id;

    v_final_quantity := LEAST(COALESCE(v_existing_quantity, 0) + p_quantity, v_stock);

    if found then
        update cart_items
        set quantity = v_final_quantity
        where cart_id = v_cart_id and product_id = p_product_id;
    else --insert if not found
        insert into cart_items (cart_id, product_id, quantity, added_at)
        values (v_cart_id, p_product_id, v_final_quantity, now());
    end if;

    return json_build_object('success', true, 'error', null, 'final_quantity', v_final_quantity);

end;
$$