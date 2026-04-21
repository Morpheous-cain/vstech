/**
 * POST /api/reviews — Submit a product review (must have ordered it).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const ReviewSchema = z.object({
  product_id: z.string().uuid(),
  order_id:   z.string().uuid().optional(),
  rating:     z.number().int().min(1).max(5),
  body:       z.string().min(10, "Review must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  const { user, error: authErr } = await requireAuth();
  if (!user) return NextResponse.json({ error: authErr }, { status: 401 });

  try {
    const body = ReviewSchema.parse(await req.json());
    const supabase = await createClient();
    const { data: customer } = await supabase.from("customers").select("id").eq("user_id", user.id).single();
    if (!customer) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const { data, error } = await supabase.from("reviews")
      .insert({ ...body, customer_id: customer.id })
      .select("*, customer:customers(name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
