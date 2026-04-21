/**
 * GET /api/search?q=query — Full-text product search via Supabase tsvector.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) return NextResponse.json({ data: [] });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, brand, category, price, images, stock")
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`)
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
