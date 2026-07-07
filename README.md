# Tanjai Silks — Next.js 14 + Supabase + Vercel + Cloudinary

A silk-saree storefront built as a **Next.js 14 App Router monolith**: SSG/ISR product
pages (SEO + speed), a strict **server-side money boundary**, Supabase (Postgres + Auth +
RLS) as the backend, and Cloudinary for image delivery. See `ARCHITECTURE.md` for the full
design and the trust-boundary diagram.

## Runs in two modes
- **Demo mode (no config):** catalogue renders from the bundled seed; payments use the
  mock gateway. `npm install && npm run dev` — browse, customise, add to cart. Auth and
  order persistence are disabled (they need Supabase).
- **Full mode:** add Supabase + (optionally) Razorpay + Cloudinary env, run the SQL, and
  auth + orders + tracking + reviews all work.

## Quick start (demo)
```bash
npm install
cp .env.local.example .env.local   # leave blank for demo mode
npm run dev                        # http://localhost:3000
```

## Enable full mode
1. Create a Supabase project (choose a region near your users, e.g. Singapore for India).
2. In the SQL editor, run in order: `supabase/migrations/0001_init.sql`,
   `supabase/policies.sql`, `supabase/seed.sql`.
3. Fill `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`  ← **server-only**, never `NEXT_PUBLIC_`
   - (optional) `RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET` + `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - (optional) `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
4. `npm run dev`.

## The money boundary (why this is safe)
- The browser uses the **anon key**, constrained by **RLS**: it can read products and its
  own orders, and insert its own reviews — nothing else. The `orders` table has **no client
  write policy**.
- **Checkout / verify / webhook** are Node-runtime route handlers using the **service-role
  key**. They re-price the cart from the DB (`lib/services/order-service.ts` → `priceCart`),
  so a client-supplied amount is ignored. Payment state is verified by HMAC signature.

## Layout
```
app/            App Router: SSG pages, client islands, /api route handlers
  api/payments/{checkout,verify,webhook}   ← server money path (service role)
lib/
  services/     business logic (pricing, order state machine, webhook)
  repositories/ data access (Supabase; falls back to seed in demo mode)
  payments/     provider-agnostic gateway (mock + razorpay)
  supabase/     browser client, server session client, service-role client, config gate
components/      SareeFigure, Nav, CartContext, useAuth, ui
supabase/        migrations/, policies.sql (RLS), seed.sql
middleware.ts    Supabase session refresh
```

## Rendering
- `/`, `/category/[slug]`, `/products/[id]` → **SSG + ISR** (`revalidate = 60`).
- `/cart`, `/checkout`, `/orders`, `/login` → client.
- `/api/*` → dynamic Node functions.

## Deploy (Vercel)
- Import the repo; set env vars in the Vercel project.
- **Co-locate** the Vercel function region with the Supabase region.
- Use Supabase's **pooled (Supavisor)** connection if you add direct DB access.
- Add the Razorpay webhook → `https://yourdomain/api/payments/webhook`.

## Not included (add when needed)
- Background jobs/queue (QStash/Inngest) for emails, webhook retries, reconciliation.
- Cloudinary **signed uploads** for user photos (arrives with the try-on service).
- Virtual try-on: a separate async GPU service (see `saree-tryon-architecture.md`).

---

## Admin, inventory & production seams (v2)

### New SQL to run (once)
After `0001_init.sql`, `policies.sql`, `seed.sql`, also run:
- `supabase/migrations/0002_admin_and_inventory.sql`

Then make yourself an admin (edit the email, run in SQL editor):
```sql
update profiles set role = 'admin' where email = 'you@example.com';
```
(The `profiles` row is created automatically on sign-up by a trigger. Register first, then run this.)

### Admin panel — `/admin`
Guarded by role (non-admins are redirected). Includes:
- **Dashboard** — product count, orders, paid revenue, low-stock alerts.
- **Products** — add/edit sarees: price, stock, colours, pattern, blurb, active toggle.
- **Orders** — every order, with fulfilment stage stepper.

### Atomic inventory
`stock` is reserved **inside the checkout transaction** via the `reserve_stock` DB function —
if any line is short, the whole reservation rolls back (no overselling). Failed payments call
`release_stock`. Out-of-stock checkouts return HTTP 409.

### Provider-agnostic seams (mock by default, live when configured)
Same pattern as the payment gateway — the app runs with none of these set:
- `lib/queue/` — async jobs (Upstash **QStash**). Falls back to inline execution in dev.
- `lib/notify/` — SMS/email (Twilio/MSG91 + Resend). Logs in dev.
- `lib/shipping/` — **Shiprocket** serviceability + shipment. Mocked in dev.
- `lib/ratelimit/` — Upstash rate limiting. Allow-all in dev.

Post-payment work (confirmation, shipment creation) is **enqueued** from the verified webhook,
not run inline — see `lib/services/order-service.ts`.

### Validation
All write routes validate input with **Zod** (`lib/validation.ts`) before any DB work.

### Note
The `/api/orders/[id]/advance` endpoint is currently open (demo stepper). Before production,
guard it with `requireAdmin` and drive stages from Shiprocket tracking instead.

---

## Product images via Supabase Storage (v3)

Real photos are stored in **Supabase Storage** (S3-backed) — Cloudinary is no longer used.
The database stores only the object **path**; the file bytes live in the bucket.

### Setup (once)
Run `supabase/migrations/0003_product_images.sql` — it adds `products.image_path`, creates the
public `saree-images` bucket, and sets Storage RLS (public read, admin-only write).

### How upload works
1. Admin picks a photo in `/admin/products` → the browser calls `POST /api/admin/upload-url`.
2. That admin-guarded route uses the service role to mint a **signed upload URL**.
3. The browser uploads the file **directly to Supabase Storage** (not through the function).
4. The returned object path is saved on the product as `image_path`.
5. Storefront renders it via `storageUrl(path)` (`lib/storage.ts`) → public bucket URL.

### Fallback
`components/ProductImage.tsx` shows the real photo when `image_path` is set, otherwise the
existing SVG saree — so products without a photo still render, and you can migrate one at a time.

### Notes
- No new env vars — uses your existing `SUPABASE_URL` + service-role key.
- Passing a `width` to `storageUrl` uses Supabase's image **render/transform** endpoint (resize +
  WebP), which is a paid-tier feature; the plain public URL works on every tier.
- Only JPG/PNG/WebP are accepted; keep photos optimised to stay within free-tier storage/egress.
