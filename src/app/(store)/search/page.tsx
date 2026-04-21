"use client"

/**
 * Search Results page — debounced full-text search via /api/search.
 */
"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";

const DEMO: Product[] = [
  { id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "", category: "Phones", brand: "Apple", price: 199999, stock: 12, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
  { id: "4", name: "MacBook Pro 14 M4", slug: "macbook-pro-14-m4", description: "", category: "Laptops", brand: "Apple", price: 249999, stock: 5, images: [], specs: {}, is_featured: true, is_active: true, created_at: "" },
];

function SearchResults() {
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    const t = setTimeout(() => {
      setResults(DEMO.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())));
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-4">Search Products</h1>
        <div className="relative max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-steel" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search phones, laptops, accessories..." className="pl-9" autoFocus />
        </div>
        {q && <p className="text-obsidian-steel text-sm mt-2">{results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;</p>}
      </div>
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : q ? (
        <div className="text-center py-16 text-obsidian-steel"><p className="text-4xl mb-4">🔍</p><p className="font-display text-xl">No results for &ldquo;{q}&rdquo;</p><p className="text-sm mt-1">Try a different search term</p></div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchResults /></Suspense>;
}
