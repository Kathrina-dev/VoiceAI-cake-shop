-- Supabase schema for Cake Shop

-- Customers
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  phone text,
  address text,
  created_at timestamptz default now()
);

-- Cakes
create table if not exists cakes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  available boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  status text default 'pending',
  total numeric,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items: each order can have multiple cake items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  cake_id uuid references cakes(id) on delete set null,
  quantity int not null default 1,
  unit_price numeric not null,
  subtotal numeric not null,
  created_at timestamptz default now()
  cake_name text not null,
);
