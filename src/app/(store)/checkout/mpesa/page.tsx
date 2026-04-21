"use client"

/**
 * M-Pesa Payment Page — phone input, STK Push trigger, live polling.
 */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DarkNavyCard } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";

type Stage = "input" | "waiting" | "success" | "failed";

export default function MpesaPage() {
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (stage !== "waiting") return;
    const t = setInterval(() => setDots((d) => d.length >= 3 ? "" : d + "."), 500);
    // Demo: auto-succeed after 5s
    const s = setTimeout(() => setStage("success"), 5000);
    return () => { clearInterval(t); clearTimeout(s); };
  }, [stage]);

  const initiate = () => {
    if (!phone.match(/^(\+254|07|01)\d{8,9}$/)) return;
    setStage("waiting");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <DarkNavyCard className="text-center">
        {stage === "input" && (<>
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
            <Smartphone size={28} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl text-foreground mb-1">Pay with M-Pesa</h1>
          <p className="text-obsidian-steel text-sm mb-2">Total: <span className="text-gold font-semibold">{formatKES(270296)}</span></p>
          <p className="text-obsidian-steel text-xs mb-6">Enter your M-Pesa registered phone number. You&apos;ll receive a PIN prompt.</p>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" type="tel" className="mb-3 text-center" />
          <button onClick={initiate} className="btn-gold w-full justify-center py-3">
            Send STK Push
          </button>
        </>)}

        {stage === "waiting" && (<>
          <Loader2 size={40} className="text-gold animate-spin mx-auto mb-4" />
          <h2 className="font-display text-xl text-foreground mb-2">Check Your Phone{dots}</h2>
          <p className="text-obsidian-steel text-sm">An M-Pesa prompt has been sent to <span className="text-gold">{phone}</span>.</p>
          <p className="text-obsidian-steel text-sm mt-1">Enter your PIN to complete payment.</p>
          <p className="text-xs text-obsidian-steel mt-6 opacity-60">Do not close this page. Waiting for confirmation...</p>
        </>)}

        {stage === "success" && (<>
          <CheckCircle size={48} className="text-status-paid mx-auto mb-4" />
          <h2 className="font-display text-2xl text-foreground mb-2">Payment Confirmed!</h2>
          <p className="text-obsidian-steel text-sm mb-1">M-Pesa Ref: <span className="text-gold font-medium">PGX8K2LM9Q</span></p>
          <p className="text-obsidian-steel text-sm mb-6">You&apos;ll receive an SMS and email confirmation shortly.</p>
          <Link href="/orders"><button className="btn-gold w-full justify-center py-3">Track My Order</button></Link>
        </>)}

        {stage === "failed" && (<>
          <div className="text-4xl mb-4">❌</div>
          <h2 className="font-display text-xl text-foreground mb-2">Payment Failed</h2>
          <p className="text-obsidian-steel text-sm mb-4">The payment was cancelled or timed out.</p>
          <button onClick={() => setStage("input")} className="btn-gold w-full justify-center py-3">Try Again</button>
        </>)}
      </DarkNavyCard>
    </div>
  );
}