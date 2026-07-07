-- ============================================================================
-- 0002 — Admin roles, admin RLS, and atomic inventory
-- Run after 0001_init.sql and policies.sql.
-- ============================================================================

-- 1) Profiles table carries the role. A trigger creates a row for every new
--    auth user (default 'customer'). Mark yourself admin with the UPDATE at the
--    bottom of this file (edit the email first).
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  role       text not null default 'customer',   -- 'customer' | 'admin'
  created_at timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper usable inside RLS: is the current user an admin?
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- 2) RLS
alter table profiles enable row level security;

create policy "profiles read own" on profiles
  for select to authenticated using (id = auth.uid() or is_admin());

-- Admins can manage the catalogue (customers still have read-only from policies.sql).
create policy "products admin write" on products
  for all to authenticated using (is_admin()) with check (is_admin());

-- Admins can read every order / item (customers keep "own only").
create policy "orders admin read" on orders
  for select to authenticated using (is_admin());
create policy "order_items admin read" on order_items
  for select to authenticated using (is_admin());
-- Admins can update fulfilment stage.
create policy "orders admin update" on orders
  for update to authenticated using (is_admin()) with check (is_admin());

-- 3) Atomic inventory
-- Reserve stock for a whole cart in ONE transaction. Raises if any line is
-- short, which rolls everything back — so no partial reservation, no overselling.
create or replace function reserve_stock(items jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb;
begin
  for it in select * from jsonb_array_elements(items) loop
    update products
       set stock = stock - (it->>'qty')::int
     where id = (it->>'productId')::text
       and stock >= (it->>'qty')::int;
    if not found then
      raise exception 'OUT_OF_STOCK:%', (it->>'productId');
    end if;
  end loop;
end; $$;

-- Release a reservation (e.g. payment failed/expired).
create or replace function release_stock(items jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb;
begin
  for it in select * from jsonb_array_elements(items) loop
    update products set stock = stock + (it->>'qty')::int
     where id = (it->>'productId')::text;
  end loop;
end; $$;

-- 4) Make yourself admin (EDIT THE EMAIL, then run this line):
-- update profiles set role = 'admin' where email = 'you@example.com';
