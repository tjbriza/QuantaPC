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