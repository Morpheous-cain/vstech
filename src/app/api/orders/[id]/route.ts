/**
 * GET   /api/orders/[id] — Get single order with items.
 * PATCH /api/orders/[id] — Admin: update order status.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

const UpdateSchema = z.object({
  status: z.enum(["Pending","Packed","Dispatched","Delivered","Cancelled"]).optional(),
  payment_status: z.enum(["Pending","Paid","Failed"]).optional(),
  notes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user, error: authErr } = await requireAuth();
  if (!user) return NextResponse.json({ error: authErr }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*), customer:customers(name, phone, email)")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { authorized, error: authErr } = await requireAdmin();
  if (!authorized) return NextResponse.json({ error: authErr }, { status: 403 });

  try {
    const body = UpdateSchema.parse(await req.json());
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders").update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
