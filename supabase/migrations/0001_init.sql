-- Schema. Money is integer paise. Orders reference auth.users (Supabase Auth).

create table if not exists products (
  id        text primary key,
  name      text not null,
  category  text not null,
  price_paise integer not null,
  base text not null, border text not null, pallu text not null, pattern text not null,
  blurb text not null,
  stock integer not null default 25,
  active boolean not null default true
);

create table if not exists reviews (
  id bigint generated always as identity primary key,
  product_id text not null references products(id),
  user_id uuid references auth.users(id),
  name text not null,
  rating int not null check (rating between 1 and 5),
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  user_id uuid references auth.users(id),
  guest_id text not null default 'anon',
  amount integer not null,
  currency text not null default 'INR',
  status text not null,                 -- created|paid|failed|confirmed|cancelled
  stage int not null default 0,         -- 0..4 fulfilment
  payment_ref text, payment_id text,
  provider text not null default 'mock',
  customer_name text, customer_phone text, customer_email text, address text,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  price integer not null,
  qty integer not null,
  design jsonb
);

create index if not exists idx_reviews_product on reviews(product_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_guest on orders(guest_id);
create index if not exists idx_items_order on order_items(order_id);
