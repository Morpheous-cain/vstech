"use client"

/**
 * Wishlist page — saved products with add-to-cart and remove actions.
 */
"use client";
import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/lib/types";

const DEMO: Product[] = [
  { id: "3", name: "MacBook Pro 14 M4", slug: "macbook-pro-14-m4", description: "", category: "Laptops", brand: "Apple", price: 249999, stock: 5, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
];

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>(DEMO);
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Saved</p>
        <h1 className="font-display text-4xl text-foreground flex items-center gap-3">
          <Heart size={28} className="text-gold" /> Wishlist
          <span className="text-base font-body text-obsidian-steel font-normal">({items.length})</span>
        </h1>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-20"><Heart size={48} className="text-obsidian-steel mx-auto mb-4" /><p className="font-display text-xl text-foreground">Your wishlist is empty</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((p) => <ProductCard key={p.id} product={p} onWishlist={(p) => remove(p.id)} />)}
        </div>
      )}
    </div>
  );
}
