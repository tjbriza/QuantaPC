create or replace function restoreOrderStock(p_order_id uuid)
returns json
language plpgsql
as $$
declare
    item_record record;
    result_count int := 0;
begin
    -- Loop through order items
    for item_record in
        select product_id, quantity
        from order_items
        where order_id = p_order_id
    loop
        update products
        set stock_quantity = stock_quantity + item_record.quantity
        where id = item_record.product_id
        returning id into strict item_record.product_id;

        result_count := result_count + 1;
    end loop;

    return json_build_object('success', true, 'items_updated', result_count);
exception
    when others then
        return json_build_object('success', false, 'message', 'unexpected error: ' || sqlerrm);
end;
$$;
