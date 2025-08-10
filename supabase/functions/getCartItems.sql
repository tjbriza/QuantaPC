create function getCartItems(p_user_id uuid)
returns table (
  cart_item_id uuid,
  product_id uuid,
  product_name text,
  product_price int,
  quantity int,
  total_per_item int
)
language sql
as $$
select
  ci.id as cart_item_id,
  p.id as product_id,
  p.name as product_name,
  p.price as product_price,
  ci.quantity,
  p.price * ci.quantity as total_per_item
from carts c
join cart_items ci on ci.cart_id = c.id
join products p on p.id = ci.product_id
where c.user_id = p_user_id
limit 50;
$$;

