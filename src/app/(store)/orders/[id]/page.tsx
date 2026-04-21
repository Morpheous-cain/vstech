/**
 * Order Detail page — items, payment status, real-time tracking.
 */
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { GoldTopCard, DarkNavyCard, OutlinedCard } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { formatKES, formatDate } from "@/lib/utils";

const STATUS_STEPS = ["Pending", "Packed", "Dispatched", "Delivered"] as const;

export default function OrderDetailPage() {
  const { id } = useParams();
  const currentStep = 2; // Dispatched

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Order</p>
        <h1 className="font-display text-3xl text-foreground">{id}</h1>
        <p className="text-obsidian-steel text-sm mt-1">Placed on {formatDate(new Date().toISOString())}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Status tracker */}
          <GoldTopCard>
            <h2 className="font-display text-sm font-semibold text-foreground mb-5">Order Status</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 h-0.5 bg-obsidian-light top-5 z-0" />
              <div className="absolute left-0 h-0.5 bg-gold top-5 z-0 transition-all" style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-1 z-10">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all ${i <= currentStep ? "border-gold bg-gold/10 text-gold" : "border-obsidian-steel bg-obsidian text-obsidian-steel"}`}>
                    {i < currentStep ? <CheckCircle size={18} /> : i === 0 ? <Package size={16} /> : i === 1 ? <Package size={16} /> : i === 2 ? <Truck size={16} /> : <Home size={16} />}
                  </div>
                  <span className={`text-xs font-medium ${i <= currentStep ? "text-gold" : "text-obsidian-steel"}`}>{step}</span>
                </div>
              ))}
            </div>
          </GoldTopCard>

          {/* Items */}
          <GoldTopCard>
            <h2 className="font-display text-sm font-semibold text-foreground mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {[{ name: "iPhone 16 Pro Max", brand: "Apple", price: 199999, qty: 1 }, { name: "AirPods Pro 2nd Gen", brand: "Apple", price: 34999, qty: 2 }].map((item) => (
                <div key={item.name} className="flex items-center gap-3 py-2 border-b border-obsidian-light last:border-0">
                  <div className="w-12 h-12 rounded bg-obsidian-light flex items-center justify-center shrink-0"><span className="text-xl opacity-40">📱</span></div>
                  <div className="flex-1">
                    <p className="text-xs text-gold/70">{item.brand}</p>
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-obsidian-steel">Qty: {item.qty}</p>
                  </div>
                  <p className="text-gold font-semibold text-sm">{formatKES(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          </GoldTopCard>
        </div>

        {/* Side summary */}
        <div className="space-y-4">
          <DarkNavyCard>
            <p className="font-display text-sm font-semibold text-foreground mb-3">Payment</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-obsidian-steel">Method</span><span className="text-foreground">M-Pesa</span></div>
              <div className="flex justify-between"><span className="text-obsidian-steel">Status</span><PaymentStatusBadge status="Paid" /></div>
              <div className="flex justify-between"><span className="text-obsidian-steel">Reference</span><span className="text-gold font-medium text-xs">PGX8K2LM9Q</span></div>
              <div className="border-t border-obsidian-light pt-2 flex justify-between font-semibold">
                <span className="text-foreground">Total</span><span className="text-gold font-display text-lg">{formatKES(269997)}</span>
              </div>
            </div>
          </DarkNavyCard>
          <OutlinedCard>
            <p className="font-display text-sm font-semibold text-foreground mb-2">Delivery Address</p>
            <p className="text-sm text-obsidian-steel">Kilimani, Nairobi<br />Gate 12, Maple Court</p>
          </OutlinedCard>
        </div>
      </div>
    </div>
  );
}
