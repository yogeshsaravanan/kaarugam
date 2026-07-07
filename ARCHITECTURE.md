# Architecture — Tanjai Silks on Next.js 14 + Supabase + Vercel + Cloudinary

The same shop, rebuilt as a **Next.js 14 App Router monolith** with Supabase as the
managed backend (Postgres + Auth + Storage + RLS), Vercel for hosting/CDN, and
Cloudinary for image delivery. This is the SEO-first, low-ops counterpart to the
React-SPA + FastAPI design in `ARCHITECTURE.md`.

The central idea to hold onto while reading: **the browser can *read* through Supabase
directly, but it can never *write money*.** Every price, order, and payment crosses a
server-side trust boundary. That boundary is drawn explicitly in §3.

---

## 1. System context

```
                         ISR/SSR HTML + JSON
   ┌────────────┐  ◄───────────────────────────  ┌──────────────────────────┐
   │  Browser   │                                 │   Next.js 14 on Vercel   │
   │  (RSC +    │  ── server actions / route ───► │  ├ Server Components(RSC)│
   │   client)  │      handlers (mutations)       │  ├ Route Handlers /api/* │
   └─────┬──────┘                                 │  └ Server Actions        │
         │  read-only (anon key, RLS)             └───────┬─────────┬────────┘
         │                                                │ service │ anon
         ▼                                                │  role   │ key
   ┌────────────┐   signed upload / transform       ┌─────▼─────────▼──────┐
   │ Cloudinary │ ◄──────────────────────────────   │      Supabase        │
   │  (images)  │                                    │  Postgres · Auth ·   │
   └────────────┘                                    │  Storage · RLS ·     │
                                                      │  Realtime            │
   ┌────────────┐   webhook (server-to-server)        └──────────────────────┘
   │  Razorpay  │ ───────────────────────────────►  (to /api/payments/webhook)
   └────────────┘
```

- **One deployable** (the Next app). No separate API service to run.
- **Supabase** is the database and identity provider; the client uses the **anon key**
  (constrained by Row-Level Security), the server uses the **service role key**.
- **Vercel** renders and caches pages at the edge and runs the server functions.
- **Cloudinary** stores and transforms product photography and (later) try-on inputs.

---

## 2. Why this stack for a shop (the tradeoff in one paragraph)

A storefront needs SEO and fast first paint; a pure SPA is weak at both. Next gives you
**SSG/ISR** for product and category pages — statically generated, CDN-cached, indexable —
which is the main reason to prefer this over the SPA+FastAPI split. Supabase removes the
auth + DB + storage boilerplate we hand-rolled. The price you pay: you lose the framework-
*enforced* layering FastAPI gave you (routers→services→repos), and Vercel's short-lived
functions mean **no long-running work** (the GPU try-on stays a separate async service, as
in `saree-tryon-architecture.md`). You also inherit two serverless-specific rules —
**pooled DB connections** and **region co-location** — covered in §8.

---

## 3. The server-side money boundary (the important diagram)

This is the single most important thing to get right on Supabase, because its default
posture is "browser talks to the database." That's fine for reads, fatal for checkout.

```
╔═══════════════ BROWSER — UNTRUSTED ════════════════════════════╗
║ supabase-js with the ANON key, every query filtered by RLS      ║
║                                                                 ║
║  CAN:   read products (public)                                  ║
║         read *its own* orders / order_items      (RLS)          ║
║         insert a review as the logged-in user    (RLS)          ║
║                                                                 ║
║  CANNOT: insert/update orders, set or send a price,             ║
║          read another user's rows, touch payment state          ║
╚════════════════════════════╤════════════════════════════════════╝
                             │  POST /api/payments/checkout
                             │  (or a Server Action) — carries the
                             │  cart as {productId, qty} only
                             ▼
╔═══════════ SERVER — TRUSTED (Vercel Node function) ═════════════╗
║ Supabase client with the SERVICE ROLE key (bypasses RLS)        ║
║                                                                 ║
║  1. verify the Supabase session (who is this user?)             ║
║  2. RE-PRICE the cart from the DB   ← client price is ignored   ║
║  3. insert order(status=created) + order_items (snapshot)       ║
║  4. gateway.createOrder(amount)     ← Razorpay / mock           ║
║  5. return { orderId, gatewayOrderId, publishableKey }          ║
╚════════════════════════════╤════════════════════════════════════╝
                             │  hosted checkout widget (card/UPI)
                             ▼
                        Razorpay ──── webhook ───► /api/payments/webhook
                                                   (raw body, HMAC verify,
                                                    idempotent → status=paid)
```

Concretely, that means:
- The **service role key is server-only** — it lives in a non-`NEXT_PUBLIC_` env var and is
  imported only from server files. If it ever reaches the client bundle, the whole model
  collapses.
- **Checkout, verify, and webhook are Route Handlers** (or Server Actions), never client
  Supabase writes. The `orders` table has **no client insert/update policy** at all.
- The webhook runs on the **Node.js runtime** (not Edge): it needs the raw request body and
  Node `crypto` for HMAC, and it uses the service key.

---

## 4. Rendering strategy (which route renders how)

| Route | Strategy | Why |
|---|---|---|
| `/` home, `/category/[slug]`, `/products/[id]` | **SSG + ISR** (`revalidate`) | SEO + speed; catalogue changes rarely, so cache and revalidate |
| `/orders`, `/orders/[id]` | **SSR (dynamic)** | Per-user, reads cookies/session; must not be cached |
| `/cart`, `/checkout` | **Client components** | Interactive UI state (cart, forms) |
| `/api/payments/*`, `/api/webhook` | **Route Handlers (Node runtime)** | Service key + raw body + crypto |
| Product images | **Cloudinary URL** via `next/image` loader | Off-app CDN, on-the-fly transforms |

ISR is what makes this stack cheap at scale: read-heavy product pages are served from the
CDN, so traffic spikes don't hammer Supabase. Revalidate on a timer, or on-demand
(`revalidatePath`) when an admin edits a product.

---

## 5. Folder layout (layering inside the monolith)

The monolith won't *force* separation, so we impose it: components never call Supabase
directly for mutations — they call services; services call repositories; repositories hold
the queries. Same discipline as the FastAPI app, by convention instead of by framework.

```
saree-next/
  app/
    (shop)/
      page.tsx                       # home            (SSG/ISR)
      category/[slug]/page.tsx       # category grid   (SSG/ISR)
      products/[id]/page.tsx         # product detail  (SSG/ISR) — RSC reads via repo
      cart/page.tsx                  # client
      checkout/page.tsx              # client shell → server action / route
      orders/page.tsx                # SSR, per-user (RLS + session)
      orders/[id]/page.tsx           # SSR tracking
    (auth)/login/page.tsx
    api/
      payments/
        checkout/route.ts            # POST — server pricing, service key
        verify/route.ts             # POST — signature check → status=paid
        webhook/route.ts            # POST — raw body, HMAC, idempotent (Node runtime)
      health/route.ts
    actions/
      checkout.ts                    # Server Action alternative to the route
      reviews.ts
    layout.tsx
  lib/
    supabase/
      client.ts                      # browser client (anon key)
      server.ts                      # server client (service role) — server-only
      session.ts                     # read/refresh auth session (cookies)
    services/                        # BUSINESS LOGIC — no HTTP, minimal Supabase
      order-service.ts               # priceCart, createOrder, verify, webhook, advance
      catalog-service.ts
      auth-service.ts
    repositories/                    # DATA ACCESS — the only place with queries
      product-repo.ts
      order-repo.ts
      review-repo.ts
    payments/                        # gateway abstraction (swap Razorpay↔Stripe here)
      gateway.ts                     # interface + factory
      razorpay.ts
      mock.ts
    cloudinary.ts                    # signed uploads, transform URL builder
    money.ts                         # paise helpers (integers only)
  components/                        # server + client UI (SareeFigure, cards, forms)
  supabase/
    migrations/                      # SQL migrations (source of truth for schema)
    policies.sql                     # RLS policies, versioned and reviewed
  types/database.ts                  # generated types from the DB schema
  middleware.ts                      # refresh session; guard /orders, /checkout
  .env.local                         # SUPABASE_SERVICE_ROLE_KEY (server-only), etc.
```

---

## 6. Data model & Row-Level Security

Same relational model as the FastAPI version (money as **integer paise**, order items as a
**price snapshot**, orders keyed to a user), but now isolation is enforced by **RLS in the
database** rather than by query filters in a service.

```
auth.users (managed by Supabase Auth)
     │1
     ▼n
orders(id, user_id→auth.users, amount, currency, status, stage,
       payment_ref, payment_id, provider, customer_*, address, created_at)
   │1
   ▼n
order_items(id, order_id→orders, product_id, name, price, qty, design jsonb)

products(id, name, category, price_paise, base/border/pallu/pattern, blurb, stock, active)
     │1
     ▼n
reviews(id, product_id→products, user_id→auth.users, name, rating, text, created_at)
```

RLS policy sketch (`supabase/policies.sql`):

| Table | SELECT | INSERT / UPDATE |
|---|---|---|
| `products` | anyone (public catalogue) | **none for clients** (admin/service only) |
| `orders` | `user_id = auth.uid()` | **none for clients** — service role only |
| `order_items` | via parent order (`user_id = auth.uid()`) | **none for clients** |
| `reviews` | anyone | INSERT where `user_id = auth.uid()` (logged-in only) |

The service role key **bypasses RLS**, which is exactly why order creation lives on the
server: the client physically cannot insert an order, and the server is the only actor that
can. RLS is powerful but security-critical — treat `policies.sql` like code: reviewed,
versioned, and tested (write a quick script that logs in as user A and asserts it can't read
user B's orders).

---

## 7. Request lifecycles

**A. Product page (SSG/ISR, no user):**
```
build/revalidate → products/[id]/page.tsx (RSC)
   → catalog-service.getProduct(id) → product-repo (anon/server read)
   → renders HTML with Cloudinary image URLs
   → Vercel caches at the edge; revalidates every N seconds
Browser gets fully-formed, indexable HTML on first byte.
```

**B. Checkout (mutation, crosses the money boundary):**
```
client checkout form → POST /api/payments/checkout  (cart = [{productId, qty}])
   → route handler: getSession() → user
   → order-service.checkout(): priceCart() re-reads prices (service key)  ← client total ignored
                               order-repo.create(order, items)            ← status=created
                               gateway.createOrder(amount)
   → returns { orderId, gatewayOrderId, publishableKey }
client opens Razorpay widget → pays → callback → POST /api/payments/verify (HMAC)
Razorpay → POST /api/payments/webhook (authoritative, idempotent → status=paid)
```

Order state machine is unchanged from the FastAPI design:
`created → paid → stage 0..4`, with `cod → confirmed`, `bad-signature → failed`.

---

## 8. Serverless rules you cannot skip

These are specific to Vercel + Supabase and are the usual production landmines:

1. **Pooled connections.** Serverless creates many short-lived function instances; a direct
   Postgres connection limit gets exhausted fast. Use Supabase's **Supavisor pooler**
   (transaction mode) connection string for the app; keep the **direct** connection only
   for migrations.
2. **Region co-location.** Put the **Vercel function region == Supabase region** (for India,
   Singapore `ap-southeast-1`). Otherwise every DB round-trip pays cross-continent latency,
   and checkout does several.
3. **Node runtime for money routes.** Webhook/checkout need raw body, `crypto`, and the
   service key → Node runtime, not Edge.
4. **No long jobs.** Vercel functions time out (seconds). Emails, webhook retries, and the
   try-on all go to a queue (§10).
5. **Service key hygiene.** `SUPABASE_SERVICE_ROLE_KEY` must never be `NEXT_PUBLIC_` and must
   only be imported from server modules.

---

## 9. Images: Cloudinary vs Supabase Storage

Both can store files — don't run both without a reason. Recommended split:

- **Cloudinary = product photography + delivery + transforms.** On-the-fly resize/format
  (`f_auto,q_auto`), responsive `srcset` via a `next/image` loader, and **signed uploads**
  for user-submitted photos (the future try-on input). This is its strength.
- **Supabase Storage = only if** media needs are light and you want one vendor; it also has
  RLS on buckets, which is convenient for private user uploads.
- Your **design studio** (recolouring the SVG saree) needs *neither* — it's client-side
  vector, zero image cost. Cloudinary earns its place only for real photos and try-on.

Pick Cloudinary as the primary image CDN; skip Supabase Storage on day one unless you have a
concrete reason.

---

## 10. What this stack still doesn't give you (add-ons)

Same gaps as any of these stacks — none ships a job queue or email:

- **Background jobs / queue:** QStash, Inngest, or Trigger.dev — for order-confirmation
  emails, webhook retries, reconciliation, and try-on orchestration.
- **Transactional email:** Resend or Postmark.
- **Error monitoring:** Sentry (Vercel integration).
- **Reconciliation job:** nightly compare gateway payments to local orders (missed webhooks).
- **Realtime tracking (nice-to-have):** Supabase Realtime can push order-stage changes to
  the `/orders` page live — a small, free win this stack uniquely enables.

---

## 11. Side-by-side with the FastAPI design

| Concern | Next 14 + Supabase (this doc) | React SPA + FastAPI (`ARCHITECTURE.md`) |
|---|---|---|
| SEO / first paint | **Strong** (SSG/ISR) | Weak (client-rendered SPA) |
| Ops burden | **Low** (managed) | Higher (run/scale the API + DB) |
| Layering enforced by | Convention (self-imposed) | **Framework** (router/service/repo) |
| Auth | **Supabase (managed)** | Hand-rolled JWT |
| Read isolation | **RLS in DB** | Query filters in services |
| Price integrity | Server route + service key | Server service |
| Vendor lock-in | Higher (Vercel/Supabase) | **Lower** (portable Python + any Postgres) |
| ML / GPU try-on fit | Awkward (needs external service) | **Natural** (Python next to GPU) |
| Long-running work | Not allowed on Vercel fns | Fine on your own workers |
| Best when | Consumer shop, speed-to-launch, SEO | Portability, strict domain, ML-heavy roadmap |

**Recommendation for this app:** if the product is a customer-facing boutique and time-to-
market and SEO matter most, **Next + Supabase + Vercel** is the better fit — provided you
hold the money boundary in §3, use pooled connections, and co-locate regions. Keep the
FastAPI design if backend portability or an ML-centric roadmap is the priority. Cloudinary is
a "yes, when you add real photography / try-on," not a day-one requirement.

---

## 12. Intentionally deferred (additions, not rewrites)

- **Admin surface** for catalogue + fulfilment (RLS admin role or a separate dashboard).
- **Alembic-equivalent** discipline = versioned `supabase/migrations` + reviewed
  `policies.sql`; never edit schema in the dashboard in production.
- **Refresh-token/session hardening** beyond Supabase defaults.
- **Virtual try-on**: separate async GPU service behind a queue, attaching to the same app
  via a job id + webhook — identical to the plan in `saree-tryon-architecture.md`.

Every deferred item slots in behind the service/repository seam or the queue, so none of
them forces a rewrite.
