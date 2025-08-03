create function remove_cart_item(p_user_id uuid, p_product_id uuid)
returns json
language plpgsql
as $$
declare
    v_cart_id uuid;
begin
    select id into v_cart_id
    from carts
    where user_id = p_user_id;

    -- check if user's cart exists
    if v_cart_id is null then
        return json_build_object('success', false, 'message', 'Cart not found for user');
    end if;

    -- delete the item from the cart
    delete from cart_items
    where cart_id = v_cart_id and product_id = p_product_id;

    -- check if the item was found
    if not found then
        return json_build_object('success', false, 'message', 'Cart item not found');
    end if;

    return json_build_object('success', true, 'message', 'Cart item removed successfully');
end;
$$;