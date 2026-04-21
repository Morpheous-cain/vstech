/**
 * PATCH /api/admin/inventory — Bulk update stock levels. Admin only.
 * Body: { updates: [{ product_id, stock }] }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const Schema = z.object({
  updates: z.array(z.object({
    product_id: z.string().uuid(),
    stock:      z.number().int().min(0),
  })).min(1),
});

export async function PATCH(req: NextRequest) {
  const { authorized, error } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error }, { status: 403 });

  try {
    const { updates } = Schema.parse(await req.json());
    const supabase = await createClient();

    const results = await Promise.all(
      updates.map(({ product_id, stock }) =>
        supabase.from("products").update({ stock }).eq("id", product_id).select("id,name,stock")
      )
    );

    const errors = results.filter(r => r.error).map(r => r.error?.message);
    if (errors.length) return NextResponse.json({ error: errors.join("; ") }, { status: 500 });

    return NextResponse.json({ data: results.map(r => r.data?.[0]), updated: updates.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
