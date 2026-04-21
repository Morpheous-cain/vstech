/**
 * GET /api/admin/analytics — Dashboard stats + monthly revenue.
 * Admin only.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET() {
  const { authorized, error } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error }, { status: 403 });

  const supabase = await createClient();

  const [statsRes, monthlyRes, lowStockRes, topProductsRes] = await Promise.all([
    supabase.rpc("admin_dashboard_stats"),
    supabase.rpc("monthly_revenue", { months_back: 12 }),
    supabase.from("products")
      .select("id,name,category,stock,brand")
      .eq("is_active", true)
      .lt("stock", 5)
      .order("stock", { ascending: true })
      .limit(10),
    supabase.from("order_items")
      .select("product_name, quantity, price")
      .limit(100),
  ]);

  return NextResponse.json({
    stats:       statsRes.data,
    monthly:     monthlyRes.data,
    low_stock:   lowStockRes.data,
    top_products: topProductsRes.data,
  });
}
