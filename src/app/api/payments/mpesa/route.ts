/**
 * POST /api/payments/mpesa — Initiate M-Pesa STK Push via Daraja API.
 * Body: { order_id, phone }
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({ order_id: z.string(), phone: z.string() });

async function getDarajaToken(): Promise<string> {
  const creds = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  const res = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: `Basic ${creds}` },
  });
  const { access_token } = await res.json();
  return access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = Schema.parse(await req.json());
    const token = await getDarajaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const phone = body.phone.replace(/^0/, "254").replace(/^\+/, "");

    const stkRes = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1, // Use real amount in production
        PartyA: phone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: `VT-${body.order_id}`,
        TransactionDesc: "VisionTech Order Payment",
      }),
    });

    const stkData = await stkRes.json();
    return NextResponse.json({ data: stkData });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
