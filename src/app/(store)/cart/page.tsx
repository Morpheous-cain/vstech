"use client"

/**
 * Cart Page — shows cart items, quantity controls, promo code, order summary.
 * State: client-side with localStorage session ID for guest carts.
 */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoldTopCard, OutlinedCard, DarkNavyCard } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";

interface CartLineItem {
  id: string; productName: string; brand: string;
  price: number; quantity: number; stock: number;
}

const DEMO_ITEMS: CartLineItem[] = [
  { id: "1", productName: "iPhone 16 Pro Max", brand: "Apple", price: 199999, quantity: 1, stock: 12 },
  { id: "2", productName: "AirPods Pro 2nd Gen", brand: "Apple", price: 34999, quantity: 2, stock: 20 },
];

export default function CartPage() {
  const [items, setItems] = useState<CartLineItem[]>(DEMO_ITEMS);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const updateQty = (id: string, delta: number) =>
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, i.quantity + delta)) } : i));

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const delivery = subtotal >= 5000 ? 0 : 299;
  const total = subtotal - discount + delivery;

  const applyPromo = () => {
    if (promo.toUpperCase() === "LAUNCH20") { setPromoApplied(true); setPromoError(""); }
    else { setPromoError("Invalid promo code"); setPromoApplied(false); }
  };

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <ShoppingBag size={48} className="text-obsidian-steel mx-auto mb-4" />
      <h1 className="font-display text-3xl text-foreground mb-2">Your cart is empty</h1>
      <p className="text-obsidian-steel mb-6">Add some products to get started</p>
      <Link href="/phones"><button className="btn-gold px-8 py-3">Browse Products</button></Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Review</p>
        <h1 className="font-display text-4xl text-foreground">Your Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <GoldTopCard key={item.id} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-obsidian-light flex items-center justify-center shrink-0">
                <span className="text-2xl opacity-40">📱</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gold/70 font-medium">{item.brand}</p>
                <p className="font-display text-sm font-medium text-foreground truncate">{item.productName}</p>
                <p className="text-gold font-semibold text-sm mt-0.5">{formatKES(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded border border-obsidian-steel text-foreground hover:border-gold/50 flex items-center justify-center">
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded border border-obsidian-steel text-foreground hover:border-gold/50 flex items-center justify-center">
                  <Plus size={12} />
                </button>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gold font-semibold text-sm">{formatKES(item.price * item.quantity)}</p>
                <button onClick={() => remove(item.id)} className="text-status-cancelled hover:text-red-400 mt-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </GoldTopCard>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Promo */}
          <OutlinedCard>
            <p className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Tag size={12} className="text-gold" /> Promo Code
            </p>
            <div className="flex gap-2">
              <Input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="e.g. LAUNCH20" className="flex-1 h-9 text-sm" />
              <button onClick={applyPromo} className="btn-secondary px-3 py-1 text-xs">Apply</button>
            </div>
            {promoApplied && <p className="text-status-paid text-xs mt-1">✓ 10% discount applied</p>}
            {promoError && <p className="text-status-cancelled text-xs mt-1">{promoError}</p>}
          </OutlinedCard>

          {/* Order summary */}
          <DarkNavyCard>
            <p className="font-display text-sm font-semibold text-foreground mb-4">Order Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-obsidian-steel"><span>Subtotal</span><span className="text-foreground">{formatKES(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-status-paid"><span>Discount (LAUNCH20)</span><span>−{formatKES(discount)}</span></div>}
              <div className="flex justify-between text-obsidian-steel"><span>Delivery</span><span className={delivery === 0 ? "text-status-paid" : "text-foreground"}>{delivery === 0 ? "Free" : formatKES(delivery)}</span></div>
              {delivery > 0 && <p className="text-xs text-obsidian-steel">Add {formatKES(5000 - subtotal)} more for free delivery</p>}
              <div className="border-t border-obsidian-light pt-2 flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-gold text-lg font-display">{formatKES(total)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <button className="btn-gold w-full mt-4 justify-center py-3">
                Checkout <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/phones">
              <button className="btn-secondary w-full mt-2 justify-center py-2 text-sm">
                Continue Shopping
              </button>
            </Link>
          </DarkNavyCard>
        </div>
      </div>
    </div>
  );
}
