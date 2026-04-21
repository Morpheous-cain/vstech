/**
 * POST /api/promo — Validate a promo code against an order total.
 * Body: { code: string, order_total: number }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({ code: z.string().min(1), order_total: z.number().int().positive() });

export async function POST(req: NextRequest) {
  try {
    const { code, order_total } = Schema.parse(await req.json());
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("validate_promo", { p_code: code, p_order_total: order_total });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
