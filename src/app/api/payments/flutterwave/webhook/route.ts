/**
 * POST /api/payments/flutterwave/webhook
 * Flutterwave sends this on payment events.
 * Verifies signature, marks order as paid.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // Verify Flutterwave signature
    const signature  = req.headers.get("verif-hash");
    const secretHash = process.env.FLW_WEBHOOK_SECRET;

    if (!signature || signature !== secretHash) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = await req.json();

    if (payload.event !== "charge.completed") {
      return NextResponse.json({ received: true });
    }

    const { data } = payload;
    if (data.status !== "successful") return NextResponse.json({ received: true });

    // tx_ref was set to VT-{order_id} when initiating the charge
    const orderId = (data.tx_ref as string)?.replace("VT-", "");
    if (!orderId) return NextResponse.json({ received: true });

    const admin = createAdminClient();
    await admin.rpc("mark_order_paid", {
      p_order_id: orderId,
      p_ref:      data.flw_ref as string,
      p_method:   "Card",
    });

    console.log(`[FLW Webhook] Order ${orderId} paid — ref ${data.flw_ref}`);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[FLW Webhook] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
