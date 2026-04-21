/**
 * GET    /api/wishlist — Customer wishlist.
 * POST   /api/wishlist — Add product.
 * DELETE /api/wishlist?product_id=x — Remove product.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const AddSchema = z.object({ product_id: z.string().uuid() });

async function getCustomerId(supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never, userId: string) {
  const { data } = await supabase.from("customers").select("id").eq("user_id", userId).single();
  return data?.id ?? null;
}

export async function GET() {
  const { user, error } = await requireAuth();
  if (!user) return NextResponse.json({ error }, { status: 401 });

  const supabase = await createClient();
  const customerId = await getCustomerId(supabase, user.id);
  if (!customerId) return NextResponse.json({ data: [] });

  const { data, error: dbErr } = await supabase
    .from("wishlist_items")
    .select("*, product:products(id,name,slug,price,images,stock,brand)")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (!user) return NextResponse.json({ error }, { status: 401 });

  try {
    const { product_id } = AddSchema.parse(await req.json());
    const supabase = await createClient();
    const customerId = await getCustomerId(supabase, user.id);
    if (!customerId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const { data, error: dbErr } = await supabase
      .from("wishlist_items").insert({ customer_id: customerId, product_id }).select().single();
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { user, error } = await requireAuth();
  if (!user) return NextResponse.json({ error }, { status: 401 });

  const productId = req.nextUrl.searchParams.get("product_id");
  if (!productId) return NextResponse.json({ error: "product_id required" }, { status: 400 });

  const supabase = await createClient();
  const customerId = await getCustomerId(supabase, user.id);
  if (!customerId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { error: dbErr } = await supabase
    .from("wishlist_items").delete().eq("customer_id", customerId).eq("product_id", productId);
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
