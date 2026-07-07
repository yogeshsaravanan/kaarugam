-- ============================================================================
-- 0003 — Product images via Supabase Storage (S3-backed)
-- Files live in the 'saree-images' bucket. The products table stores only the
-- object PATH (text), never the bytes.
-- Run after 0002_admin_and_inventory.sql.
-- ============================================================================

alter table products add column if not exists image_path text;

-- Public bucket: objects are world-readable (product photos), writes are admin-only.
insert into storage.buckets (id, name, public)
values ('saree-images', 'saree-images', true)
on conflict (id) do nothing;

-- Storage RLS (defense in depth; the signed-upload token also authorises writes).
drop policy if exists "saree images public read"  on storage.objects;
drop policy if exists "saree images admin insert"  on storage.objects;
drop policy if exists "saree images admin update"  on storage.objects;
drop policy if exists "saree images admin delete"  on storage.objects;

create policy "saree images public read" on storage.objects
  for select using (bucket_id = 'saree-images');

create policy "saree images admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'saree-images' and is_admin());

create policy "saree images admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'saree-images' and is_admin());

create policy "saree images admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'saree-images' and is_admin());
