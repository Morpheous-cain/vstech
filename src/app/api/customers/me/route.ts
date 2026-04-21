/**
 * GET   /api/customers/me — Get current customer profile.
 * PATCH /api/customers/me — Update name, phone, address.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

const UpdateSchema = z.object({
  name:    z.string().min(1).optional(),
  phone:   z.string().optional(),
  address: z.string().optional(),
}).strict();

export async function GET() {
  const { user, error: authErr } = await requireAuth();
  if (!user) return NextResponse.json({ error: authErr }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase.from("customers").select("*").eq("user_id", user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const { user, error: authErr } = await requireAuth();
  if (!user) return NextResponse.json({ error: authErr }, { status: 401 });

  try {
    const body = UpdateSchema.parse(await req.json());
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("customers").update(body).eq("user_id", user.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Bad request" }, { status: 400 });
  }
}
