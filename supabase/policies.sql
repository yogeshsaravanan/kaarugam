-- Row-Level Security. The service-role key (server) BYPASSES all of this;
-- these policies constrain the browser's anon key.

alter table products    enable row level security;
alter table reviews     enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Catalogue is public to read; no client writes (admin/service only).
create policy "products readable by all"
  on products for select using (true);

-- Reviews: anyone can read; only a logged-in user can write their own.
create policy "reviews readable by all"
  on reviews for select using (true);
create policy "reviews insert own"
  on reviews for insert to authenticated
  with check (user_id = auth.uid());

-- Orders: a user reads ONLY their own. No client insert/update at all —
-- order creation and payment state changes happen server-side (service role).
create policy "orders select own"
  on orders for select to authenticated
  using (user_id = auth.uid());

create policy "order_items select own"
  on order_items for select to authenticated
  using (exists (
    select 1 from orders o
    where o.id = order_items.order_id and o.user_id = auth.uid()
  ));
