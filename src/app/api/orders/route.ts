/**
 * GET  /api/orders — Customer's own orders (auth required).
 * POST /api/orders — Create a new order (atomic via RPC).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const CreateOrderSchema = z.object({
  delivery_address: z.string().min(5, "Delivery address required"),
  delivery_option:  z.enum(["Pickup", "Delivery"]),
  payment_method:   z.enum(["M-Pesa", "Card"]),
  promo_code:       z.string().optional(),
  notes:            z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity:   z.number().int().min(1),
    price:      z.number().int().positive(),
    name:       z.string(),
    image:      z.string().optional(),
  })).min(1, "Cart is empty"),
});

export async function GET() {
  const { user, error: authErr } = await requireAuth();
  if (!user) return NextResponse.json({ error: authErr }, { status: 401 });

  const supabase = await createClient();
  const { data: customer } = await supabase.from("customers").select("id").eq("user_id", user.id).single();
  if (!customer) return NextResponse.json({ data: [] });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const { user, error: authErr } = await requireAuth();
  if (!user) return NextResponse.json({ error: authErr }, { status: 401 });

  try {
    const body = CreateOrderSchema.parse(await req.json());
    const supabase = await createClient();

    // Get customer record
    const { data: customer } = await supabase.from("customers").select("id").eq("user_id", user.id).single();
    if (!customer) return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });

    // Use admin client for atomic RPC (bypasses RLS during stock decrement)
    const admin = createAdminClient();
    const { data, error } = await admin.rpc("create_order", {
      p_customer_id:   customer.id,
      p_delivery_addr: body.delivery_address,
      p_delivery_opt:  body.delivery_option,
      p_payment_meth:  body.payment_method,
      p_promo_code:    body.promo_code ?? null,
      p_notes:         body.notes ?? null,
      p_items:         JSON.stringify(body.items),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
