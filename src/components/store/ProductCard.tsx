"use client";
/**
 * ProductCard — improved design using shadcn-style components.
 * White/indigo theme, real images, hover effects, quick-add.
 */
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, StockBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

type ProductWithImage = Product & { imageUrl?: string; rating?: number; reviewCount?: number };

interface ProductCardProps {
  product: ProductWithImage;
  onAddToCart?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  view?: "grid" | "list";
}

function formatKES(n: number) {
  return "KES " + n.toLocaleString("en-KE");
}

export function ProductCard({ product, onAddToCart, onWishlist, view = "grid" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const rating = product.rating ?? (3.8 + Math.random() * 1.2);
  const reviewCount = product.reviewCount ?? Math.floor(Math.random() * 200 + 20);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart?.(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted(w => !w);
    onWishlist?.(product);
  };

  const imgSrc = product.imageUrl ?? (product.images?.[0] ?? null);

  if (view === "list") {
    return (
      <div className="group bg-white rounded-2xl border border-indigo-100 shadow-card hover:shadow-indigo hover:border-indigo-200 transition-all duration-300 flex gap-4 overflow-hidden p-4">
        <Link href={`/product/${product.slug}`} className="relative shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100">
          {imgSrc ? (
            <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="128px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-30">📱</div>
          )}
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">{product.brand}</p>
            <Link href={`/product/${product.slug}`}>
              <h3 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">{product.name}</h3>
            </Link>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
              ))}
              <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-indigo-600">{formatKES(product.price)}</span>
              {product.compare_price && <span className="text-xs line-through text-gray-400">{formatKES(product.compare_price)}</span>}
            </div>
            <Button size="sm" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart size={12} /> Add
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-indigo-100 shadow-card hover:shadow-indigo hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-gradient-to-br from-indigo-50 to-slate-100" style={{ aspectRatio: "4/3" }}>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">📱</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="featured">-{discount}%</Badge>}
          {product.is_featured && <Badge variant="new">★ Featured</Badge>}
        </div>

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className={cn(
              "p-2 rounded-xl border shadow-sm transition-all",
              wishlisted
                ? "bg-red-50 border-red-200 text-red-500"
                : "bg-white border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500"
            )}
          >
            <Heart size={14} className={wishlisted ? "fill-red-400" : ""} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500 shadow-sm transition-all"
          >
            <Eye size={14} />
          </Link>
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-3">
          <Button
            className="w-full text-xs py-2 shadow-lg"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {addedToCart ? (
              <span className="flex items-center gap-1.5">✓ Added!</span>
            ) : (
              <span className="flex items-center gap-1.5"><ShoppingCart size={12} /> Quick Add</span>
            )}
          </Button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">{product.brand}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-base font-bold text-indigo-600">{formatKES(product.price)}</span>
          {product.compare_price && (
            <span className="text-xs line-through text-gray-400">{formatKES(product.compare_price)}</span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <StockBadge stock={product.stock} />
        </div>
      </div>
    </div>
  );
}
