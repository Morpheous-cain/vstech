-- ============================================================
-- VisionTech — Migration 003: Stored Functions & RPC
-- ============================================================

-- ── create_order (atomic) ────────────────────────────────────
-- Creates order + items + decrements stock in one transaction.
-- Called via service-role client from /api/orders POST.
CREATE OR REPLACE FUNCTION create_order(
  p_customer_id   UUID,
  p_delivery_addr TEXT,
  p_delivery_opt  delivery_option,
  p_payment_meth  payment_method,
  p_promo_code    TEXT DEFAULT NULL,
  p_notes         TEXT DEFAULT NULL,
  p_items         JSONB DEFAULT '[]'  -- [{product_id, quantity, price, name, image}]
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order_id    UUID;
  v_discount    INTEGER := 0;
  v_total       INTEGER := 0;
  v_promo       promo_codes%ROWTYPE;
  item          JSONB;
  v_stock       INTEGER;
BEGIN
  -- Validate promo code
  IF p_promo_code IS NOT NULL THEN
    SELECT * INTO v_promo FROM promo_codes
    WHERE code = UPPER(p_promo_code) AND active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND (max_uses IS NULL OR uses < max_uses);
  END IF;

  -- Calculate subtotal
  FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_total := v_total + (item->>'price')::INTEGER * (item->>'quantity')::INTEGER;
  END LOOP;

  -- Apply discount
  IF v_promo.id IS NOT NULL THEN
    IF v_promo.min_order <= v_total THEN
      IF v_promo.discount_type = 'percent' THEN
        v_discount := (v_total * v_promo.discount_value / 100)::INTEGER;
      ELSE
        v_discount := LEAST(v_promo.discount_value, v_total);
      END IF;
    END IF;
  END IF;

  -- Insert order
  INSERT INTO orders (customer_id, total, delivery_address, delivery_option, payment_method, promo_code, discount)
  VALUES (p_customer_id, v_total - v_discount, p_delivery_addr, p_delivery_opt, p_payment_meth, p_promo_code, v_discount)
  RETURNING id INTO v_order_id;

  -- Insert items + decrement stock
  FOR item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    -- Check stock
    SELECT stock INTO v_stock FROM products WHERE id = (item->>'product_id')::UUID FOR UPDATE;
    IF v_stock < (item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Insufficient stock for product %', item->>'product_id';
    END IF;

    INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity)
    VALUES (
      v_order_id,
      (item->>'product_id')::UUID,
      item->>'name',
      COALESCE(item->>'image', ''),
      (item->>'price')::INTEGER,
      (item->>'quantity')::INTEGER
    );

    UPDATE products SET stock = stock - (item->>'quantity')::INTEGER
    WHERE id = (item->>'product_id')::UUID;
  END LOOP;

  -- Increment promo use count
  IF v_promo.id IS NOT NULL THEN
    UPDATE promo_codes SET uses = uses + 1 WHERE id = v_promo.id;
  END IF;

  RETURN jsonb_build_object('order_id', v_order_id, 'total', v_total - v_discount, 'discount', v_discount);
END;
$$;

-- ── mark_order_paid ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION mark_order_paid(
  p_order_id  UUID,
  p_ref       TEXT,
  p_method    payment_method
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE orders
  SET payment_status = 'Paid',
      mpesa_ref = CASE WHEN p_method = 'M-Pesa' THEN p_ref ELSE mpesa_ref END,
      flw_ref   = CASE WHEN p_method = 'Card'   THEN p_ref ELSE flw_ref   END,
      status    = 'Pending',
      updated_at = now()
  WHERE id = p_order_id AND payment_status = 'Pending';
END;
$$;

-- ── admin_dashboard_stats ────────────────────────────────────
CREATE OR REPLACE FUNCTION admin_dashboard_stats() RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'revenue_today',  COALESCE((SELECT SUM(total) FROM orders WHERE payment_status='Paid' AND created_at >= CURRENT_DATE), 0),
    'orders_today',   COALESCE((SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE), 0),
    'orders_pending', COALESCE((SELECT COUNT(*) FROM orders WHERE status = 'Pending'), 0),
    'products_active',COALESCE((SELECT COUNT(*) FROM products WHERE is_active = true), 0),
    'low_stock_count',COALESCE((SELECT COUNT(*) FROM products WHERE stock < 5 AND is_active = true), 0),
    'revenue_month',  COALESCE((SELECT SUM(total) FROM orders WHERE payment_status='Paid' AND created_at >= date_trunc('month', CURRENT_DATE)), 0),
    'customers_total',COALESCE((SELECT COUNT(*) FROM customers WHERE is_admin = false), 0)
  ) INTO v_result;
  RETURN v_result;
END;
$$;

-- ── monthly_revenue ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION monthly_revenue(months_back INTEGER DEFAULT 12)
RETURNS TABLE(month TEXT, revenue BIGINT) LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') AS month,
    COALESCE(SUM(total), 0) AS revenue
  FROM orders
  WHERE payment_status = 'Paid'
    AND created_at >= date_trunc('month', CURRENT_DATE) - ((months_back - 1) || ' months')::INTERVAL
  GROUP BY date_trunc('month', created_at)
  ORDER BY date_trunc('month', created_at) ASC;
$$;

-- ── validate_promo ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION validate_promo(p_code TEXT, p_order_total INTEGER)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_promo promo_codes%ROWTYPE; v_discount INTEGER;
BEGIN
  SELECT * INTO v_promo FROM promo_codes
  WHERE code = UPPER(p_code) AND active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR uses < max_uses);
  IF NOT FOUND THEN RETURN jsonb_build_object('valid', false, 'error', 'Invalid or expired promo code'); END IF;
  IF p_order_total < v_promo.min_order THEN
    RETURN jsonb_build_object('valid', false, 'error', format('Minimum order KES %s required', v_promo.min_order));
  END IF;
  IF v_promo.discount_type = 'percent' THEN
    v_discount := (p_order_total * v_promo.discount_value / 100)::INTEGER;
  ELSE
    v_discount := LEAST(v_promo.discount_value, p_order_total);
  END IF;
  RETURN jsonb_build_object('valid', true, 'discount', v_discount, 'type', v_promo.discount_type, 'value', v_promo.discount_value);
END;
$$;
