/**
 * GET /api/products/[slug] — Single product by slug with reviews.
 * PATCH /api/products/[slug] — Admin: update product fields.
 * DELETE /api/products/[slug] — Admin: soft-delete (set is_active=false).
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const UpdateSchema = z.object({
  name:          z.string().min(1).optional(),
  description:   z.string().optional(),
  price:         z.number().int().positive().optional(),
  compare_price: z.number().int().positive().nullable().optional(),
  stock:         z.number().int().min(0).optional(),
  is_featured:   z.boolean().optional(),
  is_active:     z.boolean().optional(),
  images:        z.array(z.string().url()).optional(),
  specs:         z.record(z.string()).optional(),
}).strict();

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  // Fetch reviews separately (join-style)
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, customer:customers(name)")
    .eq("product_id", product.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json({ data: { ...product, reviews: reviews ?? [] } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { authorized, error: authErr } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: authErr }, { status: 403 });

  try {
    const body = UpdateSchema.parse(await req.json());
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products").update(body).eq("slug", slug).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { authorized, error: authErr } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: authErr }, { status: 403 });

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_active: false }).eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
