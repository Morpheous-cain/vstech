"use client"

/**
 * Product Compare page — side-by-side spec table for up to 3 products.
 */
"use client";
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { GoldTopCard } from "@/components/ui/card";
import { formatKES } from "@/lib/utils";
import type { Product } from "@/lib/types";

const AVAILABLE: Product[] = [
  { id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "", category: "Phones", brand: "Apple", price: 199999, stock: 12, images: [], specs: { Display: "6.9\" OLED 120Hz", Processor: "A18 Pro", RAM: "8GB", Storage: "256GB", Camera: "48MP Triple", Battery: "4685 mAh", OS: "iOS 18" }, is_featured: true, is_active: true, created_at: "" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", description: "", category: "Phones", brand: "Samsung", price: 179999, stock: 8, images: [], specs: { Display: "6.9\" AMOLED 120Hz", Processor: "Snapdragon 8 Elite", RAM: "12GB", Storage: "512GB", Camera: "200MP Quad", Battery: "5000 mAh", OS: "Android 15" }, is_featured: false, is_active: true, created_at: "" },
  { id: "3", name: "Pixel 9 Pro", slug: "pixel-9-pro", description: "", category: "Phones", brand: "Google", price: 139999, stock: 7, images: [], specs: { Display: "6.3\" OLED 120Hz", Processor: "Tensor G4", RAM: "16GB", Storage: "256GB", Camera: "50MP Triple", Battery: "4700 mAh", OS: "Android 15" }, is_featured: false, is_active: true, created_at: "" },
];

const ALL_SPECS = ["Display", "Processor", "RAM", "Storage", "Camera", "Battery", "OS"];

export default function ComparePage() {
  const [selected, setSelected] = useState<Product[]>([AVAILABLE[0], AVAILABLE[1]]);
  const add = (p: Product) => { if (selected.length < 3 && !selected.find((s) => s.id === p.id)) setSelected([...selected, p]); };
  const remove = (id: string) => setSelected((s) => s.filter((p) => p.id !== id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Side-by-side</p>
        <h1 className="font-display text-4xl text-foreground">Compare Products</h1>
        <p className="text-obsidian-steel text-sm mt-1">Select up to 3 products to compare</p>
      </div>

      {/* Add product selector */}
      {selected.length < 3 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {AVAILABLE.filter((p) => !selected.find((s) => s.id === p.id)).map((p) => (
            <button key={p.id} onClick={() => add(p)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              <Plus size={14} /> {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-32 text-left pb-4 text-xs text-obsidian-steel uppercase tracking-wider">Spec</th>
              {selected.map((p) => (
                <th key={p.id} className="pb-4 px-3">
                  <GoldTopCard className="text-left relative">
                    <button onClick={() => remove(p.id)} className="absolute top-2 right-2 text-obsidian-steel hover:text-status-cancelled"><X size={14} /></button>
                    <div className="w-12 h-12 bg-obsidian-light rounded flex items-center justify-center mb-2"><span className="text-2xl opacity-40">📱</span></div>
                    <p className="text-xs text-gold/70">{p.brand}</p>
                    <p className="font-display text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-gold font-semibold mt-1">{formatKES(p.price)}</p>
                  </GoldTopCard>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_SPECS.map((spec, i) => (
              <tr key={spec} className={i % 2 === 0 ? "bg-obsidian-card/30" : ""}>
                <td className="py-3 pr-4 text-xs text-obsidian-steel font-medium">{spec}</td>
                {selected.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-sm text-foreground">{p.specs[spec] || "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
