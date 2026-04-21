/**
 * GET /api/cart — Retrieve cart items (guest by session_id or customer by JWT).
 * POST /api/cart — Add item to cart.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const AddSchema = z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(1).default(1) });

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const sessionId = req.cookies.get("vt_session_id")?.value;
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from("cart_items").select("*, product:products(*)");
  if (user) {
    const { data: customer } = await supabase.from("customers").select("id").eq("user_id", user.id).single();
    if (customer) query = query.eq("customer_id", customer.id);
  } else if (sessionId) {
    query = query.eq("session_id", sessionId);
  } else {
    return NextResponse.json({ data: [] });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  try {
    const body = AddSchema.parse(await req.json());
    const supabase = await createClient();
    const sessionId = req.cookies.get("vt_session_id")?.value || crypto.randomUUID();
    const { data: { user } } = await supabase.auth.getUser();

    const insert: Record<string, unknown> = { product_id: body.product_id, quantity: body.quantity };
    if (user) {
      const { data: customer } = await supabase.from("customers").select("id").eq("user_id", user.id).single();
      if (customer) insert.customer_id = customer.id;
    } else {
      insert.session_id = sessionId;
    }

    const { data, error } = await supabase.from("cart_items").insert(insert).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const res = NextResponse.json({ data });
    res.cookies.set("vt_session_id", sessionId, { httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
