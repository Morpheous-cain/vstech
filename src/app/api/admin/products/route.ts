/**
 * GET  /api/admin/products — All products (including inactive). Admin only.
 * POST /api/admin/products — Create new product. Admin only.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const CreateSchema = z.object({
  name:          z.string().min(1),
  slug:          z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, hyphens"),
  description:   z.string().min(1),
  category:      z.enum(["Phones","Laptops","Accessories"]),
  brand:         z.string().min(1),
  price:         z.number().int().positive(),
  compare_price: z.number().int().positive().optional(),
  stock:         z.number().int().min(0),
  images:        z.array(z.string()).default([]),
  specs:         z.record(z.string()).default({}),
  is_featured:   z.boolean().default(false),
  is_active:     z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const { authorized, error } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error }, { status: 403 });

  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
  const per_page = parseInt(req.nextUrl.searchParams.get("per_page") ?? "50");

  const supabase = await createClient();
  const { data, error: dbErr, count } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page-1)*per_page, page*per_page-1);

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ data, total: count, page, per_page });
}

export async function POST(req: NextRequest) {
  const { authorized, error } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error }, { status: 403 });

  try {
    const body = CreateSchema.parse(await req.json());
    const supabase = await createClient();
    const { data, error: dbErr } = await supabase.from("products").insert(body).select().single();
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
