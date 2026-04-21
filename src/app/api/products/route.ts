/**
 * GET /api/products — List products with filters.
 * Params: category, brand, search, sort, min_price, max_price, page, per_page, featured
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const QuerySchema = z.object({
  category: z.enum(["Phones","Laptops","Accessories"]).optional(),
  brand: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["price_asc","price_desc","newest","popular"]).optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(24),
  featured: z.coerce.boolean().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const q = QuerySchema.parse(params);
    const supabase = await createClient();

    let query = supabase.from("products").select("*", { count: "exact" }).eq("is_active", true);

    if (q.category) query = query.eq("category", q.category);
    if (q.brand) query = query.eq("brand", q.brand);
    if (q.featured) query = query.eq("is_featured", true);
    if (q.min_price) query = query.gte("price", q.min_price);
    if (q.max_price) query = query.lte("price", q.max_price);
    if (q.search) query = query.textSearch("name", q.search, { type: "websearch" });

    switch (q.sort) {
      case "price_asc": query = query.order("price", { ascending: true }); break;
      case "price_desc": query = query.order("price", { ascending: false }); break;
      case "newest": default: query = query.order("created_at", { ascending: false }); break;
    }

    const from = (q.page - 1) * q.per_page;
    query = query.range(from, from + q.per_page - 1);

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data, total: count, page: q.page, per_page: q.per_page });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bad request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
