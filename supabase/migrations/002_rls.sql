-- ============================================================
-- VisionTech — Migration 002: Row Level Security Policies
-- Run AFTER 001_schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes  ENABLE ROW LEVEL SECURITY;

-- ── Helper: get current customer id ──────────────────────────
-- Avoids recursive calls; reads from JWT custom claims if set,
-- otherwise falls back to a direct lookup.
CREATE OR REPLACE FUNCTION get_my_customer_id() RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT id FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_my_is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(is_admin, false) FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$;

-- ── CUSTOMERS ─────────────────────────────────────────────────
-- Users can read/update their own record. Admins can read all.
CREATE POLICY "customers_select_own"    ON customers FOR SELECT USING (user_id = auth.uid() OR get_my_is_admin());
CREATE POLICY "customers_insert_own"    ON customers FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "customers_update_own"    ON customers FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "customers_admin_all"     ON customers FOR ALL   USING (get_my_is_admin());

-- ── PRODUCTS ──────────────────────────────────────────────────
-- Public read of active products. Admins manage all.
CREATE POLICY "products_public_read"    ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_all"      ON products FOR ALL   USING (get_my_is_admin());

-- ── ORDERS ────────────────────────────────────────────────────
-- Customers see their own orders. Admins see all.
CREATE POLICY "orders_select_own"       ON orders FOR SELECT USING (customer_id = get_my_customer_id() OR get_my_is_admin());
CREATE POLICY "orders_insert_own"       ON orders FOR INSERT WITH CHECK (customer_id = get_my_customer_id());
CREATE POLICY "orders_admin_all"        ON orders FOR ALL   USING (get_my_is_admin());

-- ── ORDER ITEMS ───────────────────────────────────────────────
-- Readable if the parent order is readable.
CREATE POLICY "order_items_select"      ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND (customer_id = get_my_customer_id() OR get_my_is_admin()))
);
CREATE POLICY "order_items_admin_all"   ON order_items FOR ALL USING (get_my_is_admin());

-- ── CART ITEMS ────────────────────────────────────────────────
-- Guests own via session_id (set in cookie, passed as header). Auth users own via customer_id.
CREATE POLICY "cart_select"             ON cart_items FOR SELECT USING (customer_id = get_my_customer_id() OR auth.uid() IS NULL);
CREATE POLICY "cart_insert"             ON cart_items FOR INSERT WITH CHECK (true);  -- server validates session
CREATE POLICY "cart_delete"             ON cart_items FOR DELETE USING (customer_id = get_my_customer_id() OR auth.uid() IS NULL);
CREATE POLICY "cart_update"             ON cart_items FOR UPDATE USING (customer_id = get_my_customer_id() OR auth.uid() IS NULL);

-- ── WISHLIST ──────────────────────────────────────────────────
CREATE POLICY "wishlist_own"            ON wishlist_items FOR ALL USING (customer_id = get_my_customer_id());

-- ── REVIEWS ───────────────────────────────────────────────────
CREATE POLICY "reviews_public_read"     ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_own_insert"      ON reviews FOR INSERT WITH CHECK (customer_id = get_my_customer_id());
CREATE POLICY "reviews_own_delete"      ON reviews FOR DELETE USING (customer_id = get_my_customer_id());
CREATE POLICY "reviews_admin_all"       ON reviews FOR ALL USING (get_my_is_admin());

-- ── PROMO CODES ───────────────────────────────────────────────
-- Only admins can manage; validation via service role in API
CREATE POLICY "promos_admin_all"        ON promo_codes FOR ALL USING (get_my_is_admin());
CREATE POLICY "promos_public_read"      ON promo_codes FOR SELECT USING (active = true);
