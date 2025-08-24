create or replace function createOrderTransaction(
    p_user_id uuid,
    p_order_number varchar(50),
    p_items jsonb,
    p_subtotal int,
    p_shipping_fee int,
    p_total_amount int,
    p_customer_email varchar(255),
    p_shipping_address jsonb
)
returns json
language plpgsql
as $$
declare
    v_order_id uuid;
    v_item jsonb;
    v_product_stock int;
    v_total_items_cost int := 0;
begin
  -- validate total calculation
  if p_subtotal + p_shipping_fee != p_total_amount then
    return json_build_object('success', false, 'message', 'total amount mismatch');
  end if;

  -- validate stock and calculate subtotal
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    -- check stock availability
    select stock_quantity into v_product_stock
    from products 
    where id = (v_item->>'product_id')::uuid
    for update;

    if not found then
      return json_build_object('success', false, 'message', 'product not found: ' || (v_item->>'product_id'));
    end if;

    if v_product_stock < (v_item->>'quantity')::int then
      return json_build_object('success', false, 'message', 'insufficient stock for product: ' || (v_item->>'product_id'));
    end if;

    -- add to total cost calculation
    v_total_items_cost := v_total_items_cost + ((v_item->>'product_price')::int * (v_item->>'quantity')::int);
  end loop;

  -- validate subtotal matches item costs
  if v_total_items_cost != p_subtotal then
    return json_build_object('success', false, 'message', 'subtotal mismatch with item prices');
  end if;

  -- create the order
  insert into orders (
    user_id,
    order_number,
    subtotal,
    shipping_fee,
    total_amount,
    customer_email,
    status,
    shipping_full_name,
    shipping_phone,
    shipping_address_line,
    shipping_city,
    shipping_province,
    shipping_postal_code
  ) values (
    p_user_id,
    p_order_number,
    p_subtotal,
    p_shipping_fee,
    p_total_amount,
    p_customer_email,
    'pending',
    p_shipping_address->>'full_name',
    p_shipping_address->>'phone_number',
    (p_shipping_address->>'house_number') || ' ' || (p_shipping_address->>'street_name') || ', ' || (p_shipping_address->>'barangay'),
    p_shipping_address->>'city',
    p_shipping_address->>'province',
    p_shipping_address->>'postal_code'
  ) returning id into v_order_id;

  -- create order items and update stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    -- insert order item
    insert into order_items (order_id, product_id, quantity, price_snapshot)
    values (
      v_order_id,
      (v_item->>'product_id')::uuid,
      (v_item->>'quantity')::int,
      (v_item->>'product_price')::int
    );

    -- update product stock (reserve inventory)
    update products 
    set stock_quantity = stock_quantity - (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;

  -- clear user's cart
  delete from cart_items 
  where cart_id = (
    select id from carts where user_id = p_user_id
  ) and product_id = any(
    select (value->>'product_id')::uuid 
    from jsonb_array_elements(p_items)
  );

  return json_build_object('success', true, 'id', v_order_id, 'order_number', p_order_number);

exception
  when others then
    return json_build_object('success', false, 'message', 'database error: ' || sqlerrm);
end;
$$;