create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name_first text not null,
  name_last text not null,
  username text unique not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  role text not null default 'user'
); 

create table shipping_address (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  full_name varchar(100) not null,
  phone_number varchar(20) not null,

  country varchar(50) not null,
  region varchar(50) not null,
  province varchar(50) not null,
  city varchar(50) not null,
  barangay varchar(50) not null,
  postal_code varchar(10) not null,

  street_name varchar(100) not null,
  building_name varchar(100),
  house_number varchar(20) not null,

  address_label varchar(20) default 'Home',
  is_default boolean default false,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,          
  description text,                   -- optional for frontend
  icon_url text,                      -- optional for frontend
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  price int not null,
  stock_quantity int not null,
  category_id uuid not null references categories(id) on delete cascade,
  brand text,
  image_url text,
  created_at timestamp with time zone default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_amount int not null check (total_amount >= 0),
  status text not null default 'pending', -- options: pending, paid, shipped, cancelled
  created_at timestamptz default now()
);

-- added columns to support xendit
alter table orders add column if not exists order_number varchar(50) unique;
alter table orders add column if not exists xendit_invoice_id varchar(100) unique;
alter table orders add column if not exists xendit_invoice_url text;
alter table orders add column if not exists payment_method varchar(50);
alter table orders add column if not exists paid_at timestamp with time zone;
alter table orders add column if not exists customer_email varchar(255);
alter table orders add column if not exists subtotal int;
alter table orders add column if not exists shipping_fee int default 50; -- ₱50 
alter table orders add column if not exists expires_at timestamp with time zone;

--denormalized for order history
alter table orders add column if not exists shipping_full_name varchar(100);
alter table orders add column if not exists shipping_phone varchar(20);
alter table orders add column if not exists shipping_address_line text;
alter table orders add column if not exists shipping_city varchar(50);
alter table orders add column if not exists shipping_province varchar(50);
alter table orders add column if not exists shipping_postal_code varchar(10);

-- added more states to status
alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check 
  check (status in ('pending', 'paid', 'failed', 'expired', 'cancelled', 'shipped', 'delivered'));

-- cancellation / refund metadata (idempotent additions)
alter table orders add column if not exists cancelled_at timestamptz;
alter table orders add column if not exists cancellation_reason text;
-- future refund workflow (not yet wired in UI)
alter table orders add column if not exists refund_amount int;
alter table orders add column if not exists refunded_at timestamptz;

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null check (status in ('pending', 'paid', 'failed', 'expired', 'cancelled', 'shipped', 'delivered')),
  message text not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id) -- track which admin made the update
);

create table if not exists profile_edit_logs (
  id uuid primary key default uuid_generate_v4(),
  edited_user_id uuid not null references auth.users(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete set null,
  changed_fields text[] not null, -- list of column names that changed
  previous_values jsonb not null, -- key:value of old values
  new_values jsonb not null,      -- key:value of new values
  created_at timestamptz default now()
);

-- Index to query logs by edited user quickly
create index if not exists idx_profile_edit_logs_edited_user on profile_edit_logs(edited_user_id, created_at desc);
-- Index to query by actor
create index if not exists idx_profile_edit_logs_actor_user on profile_edit_logs(actor_user_id, created_at desc);


create table if not exists product_edit_logs (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  actor_user_id uuid not null references auth.users(id) on delete set null,
  changed_fields text[] not null,
  previous_values jsonb not null,
  new_values jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_product_edit_logs_product on product_edit_logs(product_id, created_at desc);
create index if not exists idx_product_edit_logs_actor on product_edit_logs(actor_user_id, created_at desc);


create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity int not null check (quantity > 0),
  price_snapshot int not null check (price_snapshot >= 0) -- price at time of purchase
);

create table carts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  cart_id uuid not null references carts(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  quantity int not null check (quantity > 0),
  added_at timestamptz default now()
);

create table wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  added_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Core services available on the site
create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  -- machine-friendly key to reference in code and seeds
  key text unique not null check (key in ('repairs_upgrades', 'consultation', 'technical_support')),
  name text not null,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Technicians that can be assigned to service requests
create table if not exists technicians (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique,
  phone varchar(30),
  skills jsonb, -- optional list of skills/capabilities
  active boolean default true,
  created_at timestamptz default now()
);

-- Requests submitted by users for services (repairs/upgrades, consultation, support)
create table if not exists service_requests (
  id uuid primary key default uuid_generate_v4(),

  -- who requested (nullable to allow guest submissions)
  user_id uuid references auth.users(id) on delete set null,

  -- which service
  service_id uuid not null references services(id) on delete restrict,

  service_number varchar(50) unique,

  contact_name varchar(120),
  contact_email varchar(255),
  contact_phone varchar(30),

  issue_description text not null,

  status text not null default 'pending',
  quote_amount int,               
  quote_notes text,
  scheduled_at timestamptz,
  technician_id uuid references technicians(id) on delete set null,

  -- Xendit integration (mirrors orders fields)
  xendit_invoice_id varchar(100) unique,
  xendit_invoice_url text,
  payment_method varchar(50),
  paid_at timestamptz,
  expires_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Allowed service request statuses
alter table service_requests drop constraint if exists service_requests_status_check;
alter table service_requests add constraint service_requests_status_check
  check (status in (
    'pending',      -- submitted, awaiting review/quote
    'quoted',       -- quote issued, awaiting payment
    'paid',         -- payment received
    'scheduled',    -- scheduled with a date/time
    'in_progress',  -- work is started
    'completed',    -- done
    'failed',       -- payment failed
    'expired',      -- invoice expired
    'cancelled'     -- cancelled by user/admin
  ));

-- Helpful indexes for admin dashboards and lookups
create index if not exists idx_service_requests_status_created_at on service_requests(status, created_at desc);
create index if not exists idx_service_requests_user on service_requests(user_id, created_at desc);
create index if not exists idx_service_requests_technician on service_requests(technician_id, scheduled_at);
create index if not exists idx_service_requests_service on service_requests(service_id);
create index if not exists idx_service_requests_number on service_requests(service_number);

-- Track service status changes (similar to order_status_history)
create table if not exists service_status_history (
  id uuid primary key default uuid_generate_v4(),
  service_request_id uuid not null references service_requests(id) on delete cascade,
  status text not null check (status in (
    'pending', 'quoted', 'paid', 'scheduled', 'in_progress', 'completed', 'failed', 'expired', 'cancelled'
  )),
  message text not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

create index if not exists idx_service_status_history_request on service_status_history(service_request_id, created_at desc);

-- Detailed edit logs for service requests (like profile/product edit logs)
create table if not exists service_request_edit_logs (
  id uuid primary key default uuid_generate_v4(),
  service_request_id uuid not null references service_requests(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  changed_fields text[] not null,
  previous_values jsonb not null,
  new_values jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_service_request_edit_logs_request on service_request_edit_logs(service_request_id, created_at desc);
create index if not exists idx_service_request_edit_logs_actor on service_request_edit_logs(actor_user_id, created_at desc);

-- Detailed edit logs for orders (replaces status history in audit logs)
create table if not exists order_edit_logs (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  changed_fields text[] not null,
  previous_values jsonb not null,
  new_values jsonb not null,
  created_at timestamptz default now()
);

create index if not exists idx_order_edit_logs_order on order_edit_logs(order_id, created_at desc);
create index if not exists idx_order_edit_logs_actor on order_edit_logs(actor_user_id, created_at desc); 

-- =====================================================================
-- RPC: cancel_order
-- Cancels an order (pending|paid) owned by the current user (auth.uid())
-- or any order if the caller has role 'service_role' (admin backend) and
-- restores product stock quantities (if they were decremented earlier)
-- in a single transactional, idempotent operation.
--
-- Parameters:
--   p_order          uuid      -- order id to cancel
--   p_reason         text      -- optional reason (nullable)
--   p_restore_stock  boolean   -- whether to add back stock (default true)
--
-- Behavior:
--   * Validates ownership (unless elevated) and cancellable status
--   * Updates orders.status -> cancelled, sets cancelled_at & cancellation_reason
--   * Restores stock by incrementing products.stock_quantity by each order_items.quantity
--     only when status was pending|paid and p_restore_stock = true
--   * Inserts a row into order_status_history
--   * Returns JSON summary: { success, order_id, previous_status, restored_items, message }
--
-- Idempotency:
--   * If already cancelled, returns success=false with message
--
-- NOTE: Marked SECURITY DEFINER to allow stock restoration even if future RLS
--       policies restrict direct updates. Limit exposure by granting EXECUTE
--       only to authenticated / service roles.
-- =====================================================================
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
  v_is_admin boolean := (
    exists (
      select 1 from auth.jwt() as c
      where coalesce((c.claims ->> 'role'), '') in ('service_role','admin')
    )
  );
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