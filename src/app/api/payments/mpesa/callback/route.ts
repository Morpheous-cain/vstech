/**
 * POST /api/payments/mpesa/callback
 * Safaricom Daraja sends this when STK Push completes (success or failure).
 * Mark order as paid via the mark_order_paid RPC.
 */
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface DarajaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: { Name: string; Value: string | number }[];
      };
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload: DarajaCallback = await req.json();
    const { stkCallback } = payload.Body;

    if (stkCallback.ResultCode !== 0) {
      // Payment failed — update order status
      console.warn("[M-Pesa Callback] Payment failed:", stkCallback.ResultDesc);
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    // Extract metadata
    const meta = stkCallback.CallbackMetadata?.Item ?? [];
    const get = (name: string) => meta.find(i => i.Name === name)?.Value as string;

    const mpesaRef   = get("MpesaReceiptNumber");
    const phone      = get("PhoneNumber");
    const amount     = get("Amount");
    // AccountReference was set to VT-{order_id} in the STK push
    const accountRef = get("AccountReference");
    const orderId    = accountRef?.replace("VT-", "");

    if (!orderId || !mpesaRef) {
      console.error("[M-Pesa Callback] Missing order_id or mpesa ref");
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
    }

    const admin = createAdminClient();
    await admin.rpc("mark_order_paid", {
      p_order_id: orderId,
      p_ref:      mpesaRef,
      p_method:   "M-Pesa",
    });

    console.log(`[M-Pesa Callback] Order ${orderId} paid — ref ${mpesaRef} — KES ${amount} from ${phone}`);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch (err) {
    console.error("[M-Pesa Callback] Error:", err);
    // Always return 200 to Safaricom even on internal error
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}
