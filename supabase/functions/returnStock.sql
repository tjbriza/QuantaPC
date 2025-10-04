create or replace function cancel_order(
  p_order uuid,
  p_reason text default null,
  p_restore_stock boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_order record;
  v_restored int := 0;
  v_reason text;
  -- Extract role directly; auth.jwt() returns a JSON object of claims
  v_is_admin boolean := coalesce(auth.jwt() ->> 'role', '') in ('service_role','admin');
begin
  if p_order is null then
    raise exception 'p_order is required';
  end if;

  -- Lock the order row to avoid race with shipping / other transitions
  select * into v_order from orders where id = p_order for update;
  if not found then
    return jsonb_build_object('success', false, 'message', 'Order not found');
  end if;

  -- Ownership / authorization check (skip if elevated)
  if not v_is_admin and v_order.user_id <> v_uid then
    return jsonb_build_object('success', false, 'message', 'Not authorized to cancel this order');
  end if;

  -- Already cancelled or terminal states
  if v_order.status = 'cancelled' then
    return jsonb_build_object('success', false, 'message', 'Order already cancelled');
  end if;
  if v_order.status in ('shipped','delivered') then
    return jsonb_build_object('success', false, 'message', 'Order can no longer be cancelled');
  end if;
  if v_order.status not in ('pending','paid','failed','expired') then
    return jsonb_build_object('success', false, 'message', 'Order not in cancellable state');
  end if;

  v_reason := coalesce(nullif(trim(p_reason), ''), 'User requested cancellation');

  -- Update order
  update orders
     set status = 'cancelled',
         cancelled_at = now(),
         cancellation_reason = v_reason
   where id = p_order;

  -- Restore stock only if it was an active order (pending|paid) and flag true
  if p_restore_stock and v_order.status in ('pending','paid') then
    with upd as (
      update products p
         set stock_quantity = p.stock_quantity + oi.quantity
        from order_items oi
       where oi.order_id = p_order
         and oi.product_id = p.id
      returning oi.quantity
    )
    select coalesce(sum(quantity),0) into v_restored from upd;
  end if;

  -- Insert history entry
  insert into order_status_history(order_id, status, message, created_by)
  values (p_order, 'cancelled', v_reason, v_uid);

  return jsonb_build_object(
    'success', true,
    'order_id', p_order,
    'previous_status', v_order.status,
    'restored_items', v_restored,
    'message', 'Order cancelled successfully'
  );
exception when others then
  return jsonb_build_object('success', false, 'message', SQLERRM);
end;
$$;

-- Grant execute to authenticated users (adjust as needed)
grant execute on function cancel_order(uuid, text, boolean) to authenticated;