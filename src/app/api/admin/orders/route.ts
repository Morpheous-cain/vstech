/**
 * GET /api/admin/orders — All orders with customer info + filters.
 * Admin only.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const QuerySchema = z.object({
  status:   z.enum(["Pending","Packed","Dispatched","Delivered","Cancelled"]).optional(),
  search:   z.string().optional(),
  page:     z.coerce.number().default(1),
  per_page: z.coerce.number().default(20),
});

export async function GET(req: NextRequest) {
  const { authorized, error } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error }, { status: 403 });

  const q = QuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams));
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select("*, order_items(*), customer:customers(name,phone,email)", { count: "exact" });

  if (q.status) query = query.eq("status", q.status);
  query = query.order("created_at", { ascending: false });

  const from = (q.page - 1) * q.per_page;
  query = query.range(from, from + q.per_page - 1);

  const { data, error: dbErr, count } = await query;
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ data, total: count, page: q.page, per_page: q.per_page });
}
