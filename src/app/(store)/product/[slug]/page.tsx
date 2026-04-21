"use client"

/**
 * Product Detail Page
 * Features: image gallery, specs table, reviews, add to cart, wishlist
 */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, OrderStatusBadge } from "@/components/ui/badge";
import { GoldTopCard, OutlinedCard } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import type { Product } from "@/lib/types";

// Demo product — replace with Supabase fetch by slug
const DEMO: Product = {
  id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max",
  description: "The iPhone 16 Pro Max sets a new standard for what a smartphone can do. Built with a stunning titanium design, the A18 Pro chip delivers incredible performance, and the new 48MP Fusion Camera system captures breathtaking photos and 4K video at 120fps.",
  category: "Phones", brand: "Apple", price: 199999, compare_price: 220000,
  stock: 12, images: [],
  specs: {
    Display: "6.9\" Super Retina XDR, 120Hz",
    Processor: "A18 Pro",
    Camera: "48MP Fusion + 12MP Ultra Wide + 12MP Telephoto",
    Battery: "4685 mAh, MagSafe charging",
    Storage: "256GB",
    RAM: "8GB",
    OS: "iOS 18",
    Colors: "Natural Titanium, Black Titanium, White Titanium",
    Weight: "227g",
  },
  is_featured: true, is_active: true, created_at: "",
};

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [activeSpec, setActiveSpec] = useState(0);

  const discount = DEMO.compare_price
    ? Math.round(((DEMO.compare_price - DEMO.price) / DEMO.compare_price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* ── Left: Image Gallery ────────────────── */}
        <div className="space-y-4">
          <GoldTopCard className="aspect-square flex items-center justify-center p-0 overflow-hidden">
            <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-obsidian-light to-obsidian-card flex items-center justify-center">
              <span className="text-8xl opacity-40">📱</span>
            </div>
          </GoldTopCard>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <button key={i} className="aspect-square card-outlined flex items-center justify-center hover:border-gold/50 transition-colors">
                <span className="text-2xl opacity-30">📱</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Product Info ────────────────── */}
        <div className="space-y-5">
          <div>
            <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">{DEMO.brand}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-2">{DEMO.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant={DEMO.stock > 0 ? "in-stock" : "out-stock"}>
                {DEMO.stock > 0 ? `In Stock (${DEMO.stock} left)` : "Out of Stock"}
              </Badge>
              {discount > 0 && <Badge variant="new">Save {discount}%</Badge>}
              <Badge variant="new">{DEMO.category}</Badge>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-gold">{formatKES(DEMO.price)}</span>
              {DEMO.compare_price && (
                <span className="text-obsidian-steel line-through text-lg">{formatKES(DEMO.compare_price)}</span>
              )}
            </div>
            {discount > 0 && (
              <p className="text-status-paid text-sm font-medium">
                You save {formatKES(DEMO.compare_price! - DEMO.price)}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-obsidian-steel text-sm leading-relaxed">{DEMO.description}</p>

          {/* Quantity + CTA */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-obsidian-steel rounded-md overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-foreground hover:bg-obsidian-light transition-colors">−</button>
              <span className="px-4 py-2 text-foreground font-medium min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(DEMO.stock, qty + 1))} className="px-3 py-2 text-foreground hover:bg-obsidian-light transition-colors">+</button>
            </div>
            <button className="btn-gold flex-1 py-3 justify-center" disabled={DEMO.stock === 0}>
              <ShoppingCart size={16} />
              Add to Cart
            </button>
            <button className="p-3 card-outlined hover:border-gold/50 transition-colors rounded-md">
              <Heart size={16} className="text-obsidian-steel" />
            </button>
          </div>

          {/* Payment methods */}
          <OutlinedCard className="text-sm text-obsidian-steel space-y-1">
            <p className="text-foreground font-medium text-xs uppercase tracking-wider mb-2">Payment Options</p>
            <div className="flex flex-wrap gap-2">
              {["M-Pesa STK Push", "Visa", "Mastercard"].map((m) => (
                <span key={m} className="border border-obsidian-steel px-2 py-1 rounded text-xs">{m}</span>
              ))}
            </div>
          </OutlinedCard>

          {/* Specs */}
          <div>
            <h3 className="font-display text-lg text-foreground mb-3">Specifications</h3>
            <div className="space-y-1">
              {Object.entries(DEMO.specs).map(([key, val]) => (
                <div key={key} className="flex items-start gap-3 py-2 border-b border-obsidian-light last:border-0">
                  <span className="text-xs text-obsidian-steel w-28 shrink-0 pt-0.5">{key}</span>
                  <span className="text-sm text-foreground">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-16">
        <h2 className="font-display text-2xl text-foreground mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[5, 5, 4].map((rating, i) => (
            <GoldTopCard key={i}>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={12} fill={s < rating ? "#C8A550" : "none"} stroke={s < rating ? "#C8A550" : "#3A5A7A"} />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-3">
                {i === 0 ? "Absolutely stunning device. The camera quality is unmatched." :
                 i === 1 ? "Fast delivery, genuine product. M-Pesa payment was seamless." :
                 "Great phone, worth every shilling. Battery life is impressive."}
              </p>
              <p className="text-xs text-obsidian-steel">— Verified Purchase · {["John M.", "Sarah K.", "David O."][i]}</p>
            </GoldTopCard>
          ))}
        </div>
      </div>
    </div>
  );
}
