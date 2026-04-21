-- ============================================================
-- VisionTech — Migration 001: Full Schema
-- Run in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- for fuzzy search

-- ── ENUM types ────────────────────────────────────────────────
CREATE TYPE order_status     AS ENUM ('Pending','Packed','Dispatched','Delivered','Cancelled');
CREATE TYPE payment_status   AS ENUM ('Pending','Paid','Failed');
CREATE TYPE payment_method   AS ENUM ('M-Pesa','Card');
CREATE TYPE delivery_option  AS ENUM ('Pickup','Delivery');
CREATE TYPE discount_type    AS ENUM ('percent','fixed');
CREATE TYPE product_category AS ENUM ('Phones','Laptops','Accessories');

-- ── CUSTOMERS ─────────────────────────────────────────────────
-- Extends Supabase auth.users 1:1.
CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT NOT NULL,
  address     TEXT,
  is_admin    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── PRODUCTS ──────────────────────────────────────────────────
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT NOT NULL DEFAULT '',
  category       product_category NOT NULL,
  brand          TEXT NOT NULL,
  price          INTEGER NOT NULL,               -- KES, stored as integer (no decimals)
  compare_price  INTEGER,
  stock          INTEGER NOT NULL DEFAULT 0,
  images         TEXT[] NOT NULL DEFAULT '{}',
  specs          JSONB NOT NULL DEFAULT '{}',
  is_featured    BOOLEAN NOT NULL DEFAULT false,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  search_vector  TSVECTOR,                       -- auto-updated by trigger below
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION products_search_update() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$;
CREATE TRIGGER products_search_trig BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_update();

CREATE INDEX products_search_idx ON products USING GIN(search_vector);
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_brand_idx ON products(brand);
CREATE INDEX products_price_idx ON products(price);
CREATE INDEX products_featured_idx ON products(is_featured) WHERE is_featured = true;

-- ── ORDERS ────────────────────────────────────────────────────
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id      UUID REFERENCES customers(id) ON DELETE SET NULL,
  status           order_status NOT NULL DEFAULT 'Pending',
  total            INTEGER NOT NULL,
  delivery_address TEXT NOT NULL DEFAULT '',
  delivery_option  delivery_option NOT NULL DEFAULT 'Delivery',
  payment_method   payment_method NOT NULL,
  payment_status   payment_status NOT NULL DEFAULT 'Pending',
  mpesa_ref        TEXT,
  flw_ref          TEXT,
  promo_code       TEXT,
  discount         INTEGER NOT NULL DEFAULT 0,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_customer_idx ON orders(customer_id);
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_created_idx ON orders(created_at DESC);

-- ── ORDER ITEMS ───────────────────────────────────────────────
CREATE TABLE order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT NOT NULL,
  product_image TEXT NOT NULL DEFAULT '',
  price         INTEGER NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX order_items_order_idx ON order_items(order_id);

-- ── CART ITEMS ────────────────────────────────────────────────
-- Supports both guest (session_id cookie) and logged-in users.
CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id  TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT cart_owner CHECK (session_id IS NOT NULL OR customer_id IS NOT NULL)
);

CREATE INDEX cart_session_idx ON cart_items(session_id);
CREATE INDEX cart_customer_idx ON cart_items(customer_id);

-- ── WISHLIST ──────────────────────────────────────────────────
CREATE TABLE wishlist_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- ── REVIEWS ───────────────────────────────────────────────────
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id    UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, customer_id)     -- one review per product per customer
);

CREATE INDEX reviews_product_idx ON reviews(product_id);

-- ── PROMO CODES ───────────────────────────────────────────────
CREATE TABLE promo_codes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code           TEXT NOT NULL UNIQUE,
  discount_type  discount_type NOT NULL,
  discount_value INTEGER NOT NULL,
  min_order      INTEGER NOT NULL DEFAULT 0,
  max_uses       INTEGER,
  uses           INTEGER NOT NULL DEFAULT 0,
  active         BOOLEAN NOT NULL DEFAULT true,
  expires_at     TIMESTAMPTZ
);

-- ── updated_at trigger (reusable) ────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER orders_updated_at   BEFORE UPDATE ON orders   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
