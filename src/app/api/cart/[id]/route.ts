/**
 * PATCH  /api/cart/[id] — Update cart item quantity.
 * DELETE /api/cart/[id] — Remove cart item.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const PatchSchema = z.object({ quantity: z.number().int().min(1) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { quantity } = PatchSchema.parse(await req.json());
    const supabase = await createClient();
    const { data, error } = await supabase.from("cart_items").update({ quantity }).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
