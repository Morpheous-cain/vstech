"use client"

/**
 * Checkout page — address form, delivery option, payment method selection.
 */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Phone, Truck, Package, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GoldTopCard, DarkNavyCard, OutlinedCard } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";

const ORDER_TOTAL = 269997;

export default function CheckoutPage() {
  const router = useRouter();
  const [delivery, setDelivery] = useState<"Delivery" | "Pickup">("Delivery");
  const [payment, setPayment] = useState<"M-Pesa" | "Card">("M-Pesa");
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.match(/^(\+254|07|01)\d{8,9}$/)) e.phone = "Enter a valid Kenyan phone number";
    if (delivery === "Delivery" && !form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    router.push(payment === "M-Pesa" ? "/checkout/mpesa" : "/checkout/card");
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Step 1 of 2</p>
        <h1 className="font-display text-4xl text-foreground">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <GoldTopCard>
            <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Phone size={16} className="text-gold" /> Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-obsidian-steel block mb-1">Full Name *</label>
                <Input {...field("name")} placeholder="John Kamau" />
                {errors.name && <p className="text-status-cancelled text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs text-obsidian-steel block mb-1">Phone Number *</label>
                <Input {...field("phone")} placeholder="0712 345 678" type="tel" />
                {errors.phone && <p className="text-status-cancelled text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
          </GoldTopCard>

          {/* Delivery */}
          <GoldTopCard>
            <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><Truck size={16} className="text-gold" /> Delivery Option</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(["Delivery", "Pickup"] as const).map((opt) => (
                <button key={opt} onClick={() => setDelivery(opt)}
                  className={`p-4 rounded-lg border text-sm font-medium transition-all ${delivery === opt ? "border-gold bg-gold/5 text-gold" : "border-obsidian-steel text-obsidian-steel hover:border-gold/40"}`}>
                  {opt === "Delivery" ? <><Truck size={16} className="mx-auto mb-1" />Home Delivery<br/><span className="text-xs font-normal">KES 299 (free over KES 5K)</span></> : <><Package size={16} className="mx-auto mb-1" />Store Pickup<br/><span className="text-xs font-normal">Free · Ready in 2hrs</span></>}
                </button>
              ))}
            </div>
            {delivery === "Delivery" && (
              <div>
                <label className="text-xs text-obsidian-steel block mb-1">Delivery Address *</label>
                <Input {...field("address")} placeholder="e.g. Kilimani, Nairobi — Gate 12, Maple Court" />
                {errors.address && <p className="text-status-cancelled text-xs mt-1">{errors.address}</p>}
              </div>
            )}
          </GoldTopCard>

          {/* Payment */}
          <GoldTopCard>
            <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2"><CreditCard size={16} className="text-gold" /> Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["M-Pesa", "Card"] as const).map((m) => (
                <button key={m} onClick={() => setPayment(m)}
                  className={`p-4 rounded-lg border text-sm font-medium transition-all text-left ${payment === m ? "border-gold bg-gold/5 text-gold" : "border-obsidian-steel text-obsidian-steel hover:border-gold/40"}`}>
                  <div className="font-semibold mb-0.5">{m === "M-Pesa" ? "📲 M-Pesa" : "💳 Card"}</div>
                  <div className="text-xs font-normal opacity-70">{m === "M-Pesa" ? "STK Push to your phone" : "Visa / Mastercard"}</div>
                </button>
              ))}
            </div>
          </GoldTopCard>

          {/* Notes */}
          <GoldTopCard>
            <label className="text-xs text-obsidian-steel block mb-1">Order Notes (optional)</label>
            <textarea {...field("notes")} placeholder="Any special instructions for delivery..." rows={3}
              className="w-full bg-obsidian-card border border-obsidian-steel rounded-md px-3 py-2 text-sm text-foreground placeholder:text-obsidian-steel focus:outline-none focus:border-gold/60 resize-none" />
          </GoldTopCard>
        </div>

        {/* Summary */}
        <DarkNavyCard className="h-fit">
          <p className="font-display text-sm font-semibold text-foreground mb-4">Order Summary</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-obsidian-steel"><span>iPhone 16 Pro Max ×1</span><span className="text-foreground">KES 199,999</span></div>
            <div className="flex justify-between text-obsidian-steel"><span>AirPods Pro ×2</span><span className="text-foreground">KES 69,998</span></div>
            <div className="flex justify-between text-obsidian-steel"><span>Delivery</span><span className="text-foreground">KES 299</span></div>
            <div className="border-t border-obsidian-light pt-2 flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-gold font-display text-xl">{formatKES(ORDER_TOTAL)}</span>
            </div>
          </div>
          <button onClick={submit} className="btn-gold w-full justify-center py-3">
            {payment === "M-Pesa" ? "Pay with M-Pesa" : "Pay by Card"}
          </button>
        </DarkNavyCard>
      </div>
    </div>
  );
}
