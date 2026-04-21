# VisionTech ERP — Complete Developer Guide
**v5 Frontend + Full Backend**  
*Built by Immersicloud Consulting — April 2026*

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Frontend — v5 Breakdown](#4-frontend--v5-breakdown)
5. [3D Space Hero — How It Works](#5-3d-space-hero--how-it-works)
6. [shadcn/ui Component System](#6-shadcnui-component-system)
7. [Backend Architecture](#7-backend-architecture)
8. [Database Schema](#8-database-schema)
9. [Row Level Security](#9-row-level-security)
10. [API Routes Reference](#10-api-routes-reference)
11. [Service Layer](#11-service-layer)
12. [Payment Flows](#12-payment-flows)
13. [Environment Setup](#13-environment-setup)
14. [Supabase Setup (Step-by-Step)](#14-supabase-setup-step-by-step)
15. [Local Development](#15-local-development)
16. [Deployment to Vercel](#16-deployment-to-vercel)
17. [Admin Portal Guide](#17-admin-portal-guide)
18. [Adding New Products](#18-adding-new-products)
19. [Common Issues & Fixes](#19-common-issues--fixes)

---

## 1. Project Overview

VisionTech is a full-stack e-commerce platform for a Nairobi-based electronics retailer. It features:

- A space-themed 3D hero built with Three.js
- Full product catalogue with filtering, search, and reviews
- Cart (guest + authenticated), wishlist, and checkout
- M-Pesa STK Push + Flutterwave card payments
- Admin portal: dashboard, orders, products, inventory, analytics
- Supabase backend: Postgres, Auth, RLS, stored functions

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui (built on Radix UI + CVA) |
| 3D Graphics | Three.js r160 |
| Database | Supabase (Postgres 15) |
| Auth | Supabase Auth (JWT) |
| Storage | Cloudinary CDN |
| Payments | M-Pesa Daraja API + Flutterwave |
| Deployment | Vercel |

---

## 3. Repository Structure

```
VisionTech-Redesigned/
├── src/
│   ├── app/
│   │   ├── (store)/              # Customer-facing pages
│   │   │   ├── layout.tsx        # Navbar + Footer wrapper
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── [category]/       # /phones, /laptops, /accessories
│   │   │   ├── product/[slug]/   # Product detail page
│   │   │   ├── cart/             # Cart page
│   │   │   ├── checkout/         # Checkout + M-Pesa flow
│   │   │   ├── wishlist/         # Saved items
│   │   │   ├── account/          # Customer profile + order history
│   │   │   ├── orders/           # Order list + detail
│   │   │   ├── search/           # Search results
│   │   │   └── compare/          # Product comparison
│   │   ├── admin/                # Admin portal (protected)
│   │   │   ├── layout.tsx        # Admin sidebar + topbar
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── products/         # Product management
│   │   │   ├── orders/           # Order fulfilment
│   │   │   ├── inventory/        # Stock management
│   │   │   ├── analytics/        # Revenue + charts
│   │   │   └── settings/         # Store config
│   │   ├── api/                  # Next.js API routes (Edge-compatible)
│   │   │   ├── products/         # GET list + GET/PATCH/DELETE [slug]
│   │   │   ├── orders/           # GET/POST list + GET/PATCH [id]
│   │   │   ├── cart/             # GET/POST list + PATCH/DELETE [id]
│   │   │   ├── wishlist/         # GET/POST/DELETE
│   │   │   ├── reviews/          # POST
│   │   │   ├── customers/me/     # GET/PATCH
│   │   │   ├── search/           # GET
│   │   │   ├── promo/            # POST validate
│   │   │   ├── admin/            # Admin-only routes
│   │   │   │   ├── analytics/    # GET dashboard stats
│   │   │   │   ├── orders/       # GET all orders
│   │   │   │   ├── products/     # GET/POST admin products
│   │   │   │   └── inventory/    # PATCH bulk stock update
│   │   │   └── payments/
│   │   │       ├── mpesa/        # POST STK push + /callback
│   │   │       └── flutterwave/  # /webhook
│   │   ├── auth/                 # Login/register page
│   │   ├── globals.css           # White + indigo CSS variables
│   │   └── layout.tsx            # Root layout (fonts, metadata)
│   ├── components/
│   │   ├── store/
│   │   │   ├── HeroCarousel.tsx  # Hero section (text + 3D)
│   │   │   ├── HeroScene3D.tsx   # Three.js space scene
│   │   │   ├── HeroSceneLazy.tsx # Dynamic import wrapper
│   │   │   ├── Navbar.tsx        # shadcn-based navbar
│   │   │   ├── Footer.tsx        # Footer with Separator
│   │   │   ├── ProductCard.tsx   # Grid + list view card
│   │   │   └── StatCard.tsx      # Admin stat widget
│   │   └── ui/
│   │       ├── button.tsx        # shadcn Button (6 variants)
│   │       ├── card.tsx          # Card + CardIndigoTop + CardDeep
│   │       ├── badge.tsx         # Badge + StockBadge + StatusBadges
│   │       ├── input.tsx         # Input with label/error/icon
│   │       ├── select.tsx        # Radix-based Select
│   │       └── separator.tsx     # Separator
│   ├── hooks/
│   │   ├── useAuth.ts            # Auth state hook
│   │   └── useCart.ts            # Cart state + actions hook
│   ├── lib/
│   │   ├── types.ts              # All shared TypeScript types
│   │   ├── utils.ts              # cn(), formatKES(), cloudinaryThumb()
│   │   ├── auth-helpers.ts       # requireAuth(), requireAdmin(), etc.
│   │   └── supabase/
│   │       ├── client.ts         # Browser client
│   │       ├── server.ts         # Server client (with cookies)
│   │       └── admin.ts          # Service-role client (bypasses RLS)
│   ├── services/
│   │   ├── products.ts           # getProducts(), getProduct(), search...
│   │   ├── orders.ts             # createOrder(), getOrders()...
│   │   ├── cart.ts               # getCart(), addToCart()...
│   │   └── admin.ts              # getAnalytics(), updateOrderStatus()...
│   └── middleware.ts             # Protects /admin routes
├── supabase/
│   ├── migrations/
│   │   ├── 001_schema.sql        # Tables, indexes, triggers
│   │   ├── 002_rls.sql           # Row Level Security policies
│   │   ├── 003_functions.sql     # Stored functions + RPC
│   │   └── 004_seed.sql          # Product + promo seed data
│   └── seed.sql                  # (legacy, superseded by 004)
├── .env.example                  # All environment variables documented
├── tailwind.config.ts            # Indigo color system + custom tokens
├── next.config.ts
└── VISIONTECH_GUIDE.md           # This file
```

---

## 4. Frontend — v5 Breakdown

### What changed in v5

**Hero section — complete rebuild**
- Replaced the image carousel with a full-bleed Three.js 3D scene
- Deep space environment: animated GLSL nebula shader, 1,800-star field with twinkle, 350 cosmic dust particles
- Detailed phone model: midnight-blue body, indigo chrome frame, glowing screen with UI elements (logo, product rows, CTA, Dynamic Island, 3-lens camera, side buttons)
- 7 floating crystal accents (octahedra, icosahedra, tetrahedra) in indigo/violet/cyan
- Two orbit rings; continuous phone rotation; mouse parallax on camera
- Text overlay: staggered fade-in, gradient headline, rotating feature pill, stat strip, CTA buttons

**shadcn/ui integration**
- Every interactive element uses the component library — no raw `<button>` or inline-style hover hacks
- `Button` (6 variants), `Card` (3 variants), `Badge` (8 variants), `Input` (with slots), `Select` (Radix), `Separator`
- All admin pages rebuilt with consistent component usage

**Homepage structure**
- Hero → Price tier shortcuts → Categories (shadcn Cards) → Featured products → Phones → Deal banner → Laptops → Accessories → Why VisionTech

---

## 5. 3D Space Hero — How It Works

### File: `src/components/store/HeroScene3D.tsx`

The scene is built entirely with raw Three.js (no react-three-fiber) to keep the bundle lean and give maximum control.

#### Scene graph

```
Scene
├── bgMesh          — ShaderMaterial plane (GLSL nebula, never moves)
├── stars           — Points system, 1800 stars with twinkle shader
├── dust            — Points system, 350 indigo/violet particles
├── phoneGroup      — Rotates + floats; contains:
│   ├── body        — BoxGeometry, midnight blue MeshStandardMaterial
│   ├── back        — Glass panel with subtle shimmer
│   ├── frame ×4    — Indigo chrome frame segments
│   ├── screen      — Glowing dark blue emissive plane
│   ├── UI elements — 30+ flat BoxGeometry quads (screen icons, logo, rows)
│   ├── diMesh      — Dynamic Island
│   ├── camera island + 3 lenses
│   └── side buttons + corner glints
├── orbitRing       — Torus, indigo, rotates on z-axis
├── ring2           — Torus, violet, counter-rotates
└── crystals ×7     — Floating polyhedra with wireframe overlays
```

#### Lighting rig

| Light | Color | Purpose |
|---|---|---|
| AmbientLight | `#111133` | Lifts black shadows, keeps space feeling |
| DirectionalLight (key) | `#c8d8ff` | Cool blue-white from front-left |
| DirectionalLight (rim) | `#9060ff` | Warm violet from behind-right |
| PointLight (screen) | `#aabbff` | Pulses to simulate screen glow |
| PointLight (fill) | `#4040cc` | Indigo uplighting from below |

#### Performance notes

- Single `requestAnimationFrame` loop — no React re-renders
- `Math.min(devicePixelRatio, 2)` caps pixel density on retina
- All geometries and materials are disposed on unmount via cleanup function
- Three.js is tree-shaken — only used classes are bundled
- Dynamic import (`ssr: false`) prevents server-side crash since WebGL requires browser

#### Responsiveness

```typescript
if (w < 768) {
  // Mobile: phone centred, wider FOV, closer camera
  camera.fov = 55;
  phoneGroup.position.set(0, 0, 0);
} else if (w < 1024) {
  // Tablet: phone slightly right
  phoneGroup.position.set(1.2, 0, 0);
} else {
  // Desktop: phone right, text left
  phoneGroup.position.set(1.8, 0, 0);
}
```

---

## 6. shadcn/ui Component System

All components live in `src/components/ui/`. They follow the shadcn/ui pattern: built on Radix UI primitives, styled with Tailwind, typed with TypeScript.

### Button variants

```tsx
<Button>Default (indigo filled)</Button>
<Button variant="secondary">Light indigo</Button>
<Button variant="outline">Indigo border</Button>
<Button variant="ghost">Text only</Button>
<Button variant="destructive">Red</Button>
<Button variant="white">White card style</Button>
<Button size="sm|md|lg|icon">...</Button>
```

### Card variants

```tsx
<Card>Standard white card with indigo border</Card>
<CardIndigoTop>White card with indigo gradient top bar</CardIndigoTop>
<CardDeep>Dark indigo card for contrast sections</CardDeep>
```

### Badge variants

```tsx
<Badge variant="indigo|success|warning|danger|in-stock|low-stock|out-stock|featured|new" />
<StockBadge stock={5} />          // auto-picks in-stock|low-stock|out-stock
<OrderStatusBadge status="Pending" />
<PaymentStatusBadge status="Paid" />
```

### Input

```tsx
<Input
  label="Email"
  placeholder="you@example.com"
  leftIcon={<Mail size={14} />}
  error="Invalid email"
/>
```

### Select (Radix)

```tsx
<Select value={val} onValueChange={setVal}>
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>
```

---

## 7. Backend Architecture

### Request flow

```
Browser / Admin
    │
    ▼
Next.js API Route (/api/...)
    │
    ├── Zod schema validation
    ├── Auth check (requireAuth / requireAdmin)
    │
    ▼
Supabase Client
    ├── Server client  (anon key + cookies) — respects RLS
    └── Admin client   (service-role key)   — bypasses RLS
    │
    ▼
Postgres (Supabase)
    ├── Tables (products, orders, cart_items, ...)
    ├── RLS policies
    └── Stored functions (create_order, mark_order_paid, ...)
```

### Two Supabase clients

| Client | Key | Used for | RLS |
|---|---|---|---|
| `createClient()` in `lib/supabase/server.ts` | Anon key | Normal reads, auth operations | ✅ Enforced |
| `createAdminClient()` in `lib/supabase/admin.ts` | Service role key | Atomic order creation, payment callbacks, admin mutations | ❌ Bypassed |

> **Never** expose the service role key to the browser. It is only used in API routes (`/api/...`) which run server-side.

---

## 8. Database Schema

### Tables overview

```
customers        — extends auth.users 1:1
products         — catalogue with full-text search vector
orders           — customer orders with payment/delivery info
order_items      — line items (denormalised: name, price at time of purchase)
cart_items       — guest (session_id cookie) or auth (customer_id)
wishlist_items   — per-customer saved products
reviews          — 1 per product per customer, linked to order
promo_codes      — discount codes (percent or fixed KES)
```

### Key design decisions

**`order_items` denormalises product name + price** — this ensures historical orders show the correct price even if the product is later updated.

**`products.price` is INTEGER (KES, no decimals)** — KES doesn't use fractional amounts. `199999` = KES 199,999.

**`cart_items` dual ownership** — a cart item has either `session_id` (guest, from `vt_session_id` cookie) or `customer_id` (logged-in user). The `CONSTRAINT cart_owner` enforces at least one is set.

**`products.search_vector`** — a `tsvector` column updated by trigger on every INSERT/UPDATE. Weighted: `A=name`, `B=brand`, `C=description`. Used for fast full-text search with the GIN index.

---

## 9. Row Level Security

### Policy matrix

| Table | Public (anon) | Logged-in customer | Admin |
|---|---|---|---|
| products | SELECT (active only) | SELECT (active only) | ALL |
| customers | — | SELECT/UPDATE own | ALL |
| orders | — | SELECT/INSERT own | ALL |
| order_items | — | SELECT (own orders) | ALL |
| cart_items | SELECT/INSERT/DELETE (session) | SELECT/INSERT/DELETE (own) | ALL |
| wishlist_items | — | ALL (own) | ALL |
| reviews | SELECT (all) | INSERT/DELETE own | ALL |
| promo_codes | SELECT (active) | SELECT (active) | ALL |

### Helper functions (avoid recursion)

```sql
-- Safe: reads directly from table without calling itself
CREATE FUNCTION get_my_customer_id() RETURNS UUID AS $$
  SELECT id FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$ SECURITY DEFINER;

CREATE FUNCTION get_my_is_admin() RETURNS BOOLEAN AS $$
  SELECT COALESCE(is_admin, false) FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$ SECURITY DEFINER;
```

> These are `SECURITY DEFINER` (run as the function owner, not the caller) to avoid the RLS infinite recursion bug that would occur if the policies called back into the table they protect.

---

## 10. API Routes Reference

### Public endpoints (no auth)

| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | List products. Params: `category`, `brand`, `search`, `sort`, `min_price`, `max_price`, `page`, `per_page`, `featured` |
| GET | `/api/products/[slug]` | Single product + reviews |
| GET | `/api/search?q=` | Full-text search (min 2 chars) |
| GET | `/api/cart` | Cart items (guest via cookie or auth) |
| POST | `/api/cart` | Add item. Body: `{ product_id, quantity }` |
| POST | `/api/promo` | Validate promo. Body: `{ code, order_total }` |

### Auth-required endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/orders` | Customer's order history |
| POST | `/api/orders` | Create order (atomic) |
| GET | `/api/orders/[id]` | Single order + items |
| GET | `/api/customers/me` | Own profile |
| PATCH | `/api/customers/me` | Update name/phone/address |
| GET | `/api/wishlist` | Wishlist items |
| POST | `/api/wishlist` | Add to wishlist |
| DELETE | `/api/wishlist?product_id=` | Remove from wishlist |
| POST | `/api/reviews` | Submit review |
| PATCH | `/api/cart/[id]` | Update quantity |
| DELETE | `/api/cart/[id]` | Remove item |
| POST | `/api/payments/mpesa` | Initiate STK Push |

### Admin-only endpoints

| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/analytics` | Dashboard stats + monthly revenue |
| GET | `/api/admin/orders` | All orders with filters |
| GET | `/api/admin/products` | All products (including inactive) |
| POST | `/api/admin/products` | Create new product |
| PATCH | `/api/products/[slug]` | Update any product field |
| DELETE | `/api/products/[slug]` | Soft delete (set inactive) |
| PATCH | `/api/orders/[id]` | Update order status |
| PATCH | `/api/admin/inventory` | Bulk update stock |

### Webhook endpoints (no auth, signature-verified)

| Method | Route | Description |
|---|---|---|
| POST | `/api/payments/mpesa/callback` | Safaricom Daraja callback |
| POST | `/api/payments/flutterwave/webhook` | Flutterwave payment event |

---

## 11. Service Layer

Import from `@/services/...` in your components instead of calling `fetch` directly.

```typescript
// Products
import { getProducts, getProduct, searchProducts } from "@/services/products";

const { data, total } = await getProducts({ category: "Phones", sort: "price_asc" });
const product = await getProduct("iphone-16-pro-max");

// Cart
import { getCart, addToCart, removeFromCart } from "@/services/cart";

await addToCart("product-uuid", 1);
const items = await getCart();

// Orders
import { createOrder, getOrders } from "@/services/orders";

const result = await createOrder({
  delivery_address: "Westlands, Nairobi",
  delivery_option: "Delivery",
  payment_method: "M-Pesa",
  items: [{ product_id: "uuid", quantity: 1, price: 199999, name: "iPhone 16 Pro Max" }],
});

// Admin
import { getAnalytics, updateOrderStatus } from "@/services/admin";

const stats = await getAnalytics();
await updateOrderStatus("order-uuid", "Dispatched");
```

---

## 12. Payment Flows

### M-Pesa STK Push

```
1. Customer enters phone at checkout
2. POST /api/payments/mpesa  →  getDarajaToken()  →  STK Push request
3. Customer sees M-Pesa PIN prompt on their phone
4. Customer enters PIN → Safaricom processes
5. POST /api/payments/mpesa/callback  →  mark_order_paid() RPC
6. Order status: Pending (confirmed payment) → Admin dispatches
```

**Daraja environment**
- Sandbox: `https://sandbox.safaricom.co.ke`
- Production: `https://api.safaricom.co.ke`
- Change the URLs in `/api/payments/mpesa/route.ts` when going live

**Callback URL** must be publicly accessible. Use [ngrok](https://ngrok.com) for local testing:
```bash
ngrok http 3000
# Then set MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/payments/mpesa/callback
```

### Flutterwave Card Payments

```
1. Customer selects "Card" at checkout
2. Frontend loads Flutterwave inline JS (from their CDN)
3. Customer completes card payment in Flutterwave modal
4. Flutterwave sends POST /api/payments/flutterwave/webhook
5. Signature verified against FLW_WEBHOOK_SECRET
6. mark_order_paid() RPC updates order
```

---

## 13. Environment Setup

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### Required variables

```
# Supabase (get from dashboard.supabase.com > Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # NEVER expose to browser

# M-Pesa (get from developer.safaricom.co.ke)
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=174379             # Sandbox default
MPESA_CALLBACK_URL=https://your-domain.vercel.app/api/payments/mpesa/callback

# Flutterwave (get from dashboard.flutterwave.com)
FLW_PUBLIC_KEY=FLWPUBK_TEST-...
FLW_SECRET_KEY=FLWSECK_TEST-...
FLW_WEBHOOK_SECRET=your-random-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 14. Supabase Setup (Step-by-Step)

### Step 1 — Create project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose region closest to Kenya: `eu-west-2` (London) or `af-south-1` (Cape Town)
3. Set a strong database password and save it

### Step 2 — Run migrations in order

Go to **SQL Editor** → **New Query** and run each file:

```
1. supabase/migrations/001_schema.sql   ← Tables, indexes, triggers
2. supabase/migrations/002_rls.sql      ← Row Level Security policies
3. supabase/migrations/003_functions.sql ← Stored functions (create_order, etc.)
4. supabase/migrations/004_seed.sql     ← 12 products + promo codes
```

Run them **one at a time** in order. Each must succeed before running the next.

### Step 3 — Enable email auth

Go to **Authentication → Providers → Email** → ensure it's enabled.

For production: disable "Confirm email" during development for faster testing, then re-enable.

### Step 4 — Create first admin user

1. In Supabase dashboard, go to **Authentication → Users → Invite user** (or sign up via your `/auth` page)
2. After the user signs in once, go to **SQL Editor** and run:
```sql
-- Replace with the actual user's auth.users UUID
UPDATE customers SET is_admin = true
WHERE user_id = 'paste-auth-user-uuid-here';
```

### Step 5 — Get API keys

Go to **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (keep secret)

### Step 6 — Configure Realtime (optional)

For live order updates in admin: **Database → Replication → Tables** → enable `orders` and `order_items`.

---

## 15. Local Development

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy env
cp .env.example .env.local
# Fill in your Supabase keys (minimum required to run)

# 3. Start dev server
npm run dev

# 4. Open browser
# Store: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Testing without Supabase

The homepage, hero, and catalogue pages work immediately with hardcoded demo data (no DB connection needed). API routes will fail until Supabase is configured.

---

## 16. Deployment to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "VisionTech v5"
git remote add origin https://github.com/your-org/visiontech.git
git push -u origin main

# 2. Connect to Vercel
# Go to vercel.com → New Project → Import your repo

# 3. Add all environment variables in Vercel dashboard
# Project → Settings → Environment Variables
# Add every variable from .env.example

# 4. Deploy
vercel --prod
```

### Important Vercel settings

- **Framework Preset**: Next.js (auto-detected)
- **Node.js version**: 20.x
- **Build command**: `next build` (default)
- After adding env vars, always trigger a new deployment

---

## 17. Admin Portal Guide

Access at `/admin` — requires `is_admin = true` in the `customers` table.

### Dashboard `/admin`

- 8 stat cards: revenue today, orders, customers, low stock, M-Pesa revenue, dispatched, monthly total
- Monthly revenue bar chart (12 months)
- Low stock alert cards
- Recent orders table
- Top products by revenue

### Orders `/admin/orders`

- Search by customer name or order ID
- Filter by status (Pending / Packed / Dispatched / Delivered / Cancelled)
- Revenue summary for current filter
- Click arrow on any row → order detail (via `/admin/orders/[id]`)
- Update status via the PATCH `/api/orders/[id]` endpoint

### Products `/admin/products`

- Table with real product images (from `images[]` array)
- Toggle active/hidden (PATCH `is_active`)
- Category filter + search
- Link to edit page, delete (soft: sets `is_active=false`)
- "Add Product" → `/admin/products/new`

### Inventory `/admin/inventory`

- Shows all products with current stock
- Red/amber/green status indicators
- "+10 units" and "+50 units" quick restock buttons
- Alert banner lists all items at or below threshold (< 5 stock)

### Analytics `/admin/analytics`

- KPI strip: revenue, orders, customers, avg order value
- Monthly revenue bar chart with hover tooltip
- Category breakdown with progress bars
- Payment method split (M-Pesa vs Card)
- Top customers by lifetime value

---

## 18. Adding New Products

### Via Admin UI

1. Go to `/admin/products` → **Add Product**
2. Fill in name, slug (lowercase-hyphenated), description
3. Set category, brand, price, stock
4. Add specs as key-value rows
5. Paste image URL (Cloudinary or Unsplash for dev)
6. Toggle "Active" on → Save

### Via SQL (faster for bulk)

```sql
INSERT INTO products (name, slug, description, category, brand, price, stock, images, specs, is_featured, is_active)
VALUES (
  'OnePlus 12',
  'oneplus-12',
  'Hasselblad cameras, 100W SUPERVOOC, 2K ProXDR display.',
  'Phones',
  'OnePlus',
  99999,
  11,
  '{"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"}',
  '{"Processor":"Snapdragon 8 Gen 3","RAM":"12GB","Storage":"256GB"}',
  false,
  true
);
```

### Via API (programmatic)

```typescript
const product = await createAdminProduct({
  name: "OnePlus 12",
  slug: "oneplus-12",
  // ...
});
```

---

## 19. Common Issues & Fixes

### `'next' is not recognized`

You're in the wrong folder. The project root with `package.json` is inside the zip:
```
cd VisionTech-Redesigned   ← this is the project root
npm install --legacy-peer-deps
npm run dev
```

### `ERESOLVE` on npm install

`@react-three/fiber` requires React 18 but the project uses React 19:
```bash
npm install --legacy-peer-deps
```

### Event handlers cannot be passed to Client Component

A component using `useState`, `useEffect`, or DOM event handlers is missing `"use client"` at the top:
```typescript
"use client";   // ← add this as the FIRST line
import React from "react";
// ...
```

### `get_my_role()` stack depth error

This happened in a previous version where the RLS policy helper called itself recursively. Fixed in `002_rls.sql` by using `SECURITY DEFINER` functions that read directly from the table without going through RLS.

### Admin page shows blank / redirects to `/auth`

The middleware at `src/middleware.ts` protects `/admin`. Make sure:
1. You are logged in (Supabase session cookie must exist)
2. Your `customers` row has `is_admin = true`
3. Check the Supabase dashboard → Authentication → Users to confirm your user exists

### M-Pesa callback not reaching localhost

Safaricom cannot call `localhost`. During development, use [ngrok](https://ngrok.com):
```bash
ngrok http 3000
# Set MPESA_CALLBACK_URL=https://xxxx.ngrok.io/api/payments/mpesa/callback
```

### Supabase RLS blocking queries

If data isn't loading, the RLS policy may be blocking. Debug in Supabase SQL Editor:
```sql
-- Temporarily disable to test (re-enable after!)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Check what policies exist
SELECT * FROM pg_policies WHERE tablename = 'products';
```

---

*End of VisionTech Developer Guide — v5*  
*Questions? Contact Immersicloud Consulting.*
