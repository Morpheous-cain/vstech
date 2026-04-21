"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Shield, Truck, Headphones, CreditCard, Star, Zap, Award, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";

const HeroCarousel = dynamic(() => import("@/components/store/HeroCarousel"), {
  ssr: false,
  loading: () => (
    <div className="w-full" style={{ height: "100svh", minHeight: "640px", background: "#020408" }} />
  ),
});

type ProductWithImage = Product & { imageUrl?: string; rating?: number; reviewCount?: number };

const ALL_PRODUCTS: ProductWithImage[] = [
  { id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "A18 Pro chip, titanium design, 48MP Fusion Camera.", category: "Phones", brand: "Apple", price: 199999, compare_price: 220000, stock: 12, images: [], specs: {}, is_featured: true, is_active: true, created_at: "", rating: 4.9, reviewCount: 312, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=85&fit=crop" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", description: "S Pen, 200MP camera, and Galaxy AI.", category: "Phones", brand: "Samsung", price: 179999, compare_price: 195000, stock: 8, images: [], specs: {}, is_featured: true, is_active: true, created_at: "", rating: 4.8, reviewCount: 204, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=85&fit=crop" },
  { id: "3", name: "MacBook Pro 14\" M4", slug: "macbook-pro-14-m4", description: "M4 chip, Liquid Retina XDR display, 18hr battery.", category: "Laptops", brand: "Apple", price: 249999, compare_price: 275000, stock: 5, images: [], specs: {}, is_featured: true, is_active: true, created_at: "", rating: 4.9, reviewCount: 189, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=85&fit=crop" },
  { id: "4", name: "Google Pixel 9 Pro", slug: "pixel-9-pro", description: "Magic Eraser, 50MP camera, 7 years of AI updates.", category: "Phones", brand: "Google", price: 139999, compare_price: 155000, stock: 7, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 98, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=85&fit=crop" },
  { id: "5", name: "Samsung Galaxy A55", slug: "samsung-galaxy-a55", description: "120Hz AMOLED, 50MP OIS camera, 5000mAh battery.", category: "Phones", brand: "Samsung", price: 64999, compare_price: 72000, stock: 18, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.5, reviewCount: 167, imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=85&fit=crop" },
  { id: "6", name: "Dell XPS 15 OLED", slug: "dell-xps-15", description: "OLED display, Intel Core Ultra 7, 64GB RAM.", category: "Laptops", brand: "Dell", price: 189999, compare_price: undefined, stock: 3, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 67, imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=85&fit=crop" },
  { id: "7", name: "iPhone 15", slug: "iphone-15", description: "USB-C, Dynamic Island, 48MP main camera.", category: "Phones", brand: "Apple", price: 129999, compare_price: 145000, stock: 15, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 288, imageUrl: "https://images.unsplash.com/photo-1697543603910-d6d5af5e7af2?w=600&q=85&fit=crop" },
  { id: "8", name: "Tecno Spark 30 Pro", slug: "tecno-spark-30-pro", description: "6.78\" 120Hz display, 64MP camera, 5000mAh.", category: "Phones", brand: "Tecno", price: 18999, compare_price: 22000, stock: 30, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.2, reviewCount: 145, imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=85&fit=crop" },
  { id: "9", name: "AirPods Pro 2nd Gen", slug: "airpods-pro-2", description: "Active noise cancellation, USB-C, 30hr battery.", category: "Accessories", brand: "Apple", price: 34999, compare_price: 39999, stock: 20, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.8, reviewCount: 356, imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=600&q=85&fit=crop" },
  { id: "10", name: "Samsung Galaxy Buds3 Pro", slug: "galaxy-buds3-pro", description: "360 Audio, ANC, 30hr total playback.", category: "Accessories", brand: "Samsung", price: 24999, compare_price: 29999, stock: 14, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.6, reviewCount: 178, imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=85&fit=crop" },
  { id: "11", name: "Lenovo IdeaPad Slim 5", slug: "lenovo-ideapad-slim5", description: "AMD Ryzen 7, 16GB RAM, 15.6\" FHD IPS.", category: "Laptops", brand: "Lenovo", price: 79999, compare_price: 92000, stock: 9, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.4, reviewCount: 134, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=85&fit=crop" },
  { id: "12", name: "Apple Watch Series 10", slug: "apple-watch-s10", description: "Thinnest Apple Watch ever. Advanced health sensors.", category: "Accessories", brand: "Apple", price: 54999, compare_price: 62000, stock: 17, images: [], specs: {}, is_featured: false, is_active: true, created_at: "", rating: 4.8, reviewCount: 224, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=85&fit=crop" },
];

const CATEGORIES = [
  { name: "Phones",      icon: "📱", href: "/phones",      count: "120+ models", desc: "From flagship to budget",  gradient: "from-indigo-50 to-indigo-100",  border: "border-indigo-200",  accent: "text-indigo-600" },
  { name: "Laptops",     icon: "💻", href: "/laptops",     count: "80+ models",  desc: "Work, create, game",     gradient: "from-sky-50 to-sky-100",       border: "border-sky-200",     accent: "text-sky-600" },
  { name: "Accessories", icon: "🎧", href: "/accessories", count: "200+ items",  desc: "Earbuds, cases & more",  gradient: "from-violet-50 to-violet-100", border: "border-violet-200",  accent: "text-violet-600" },
];

const WHY_US = [
  { icon: <CreditCard size={20} />, title: "M-Pesa & Card", desc: "Pay instantly with M-Pesa STK Push or Visa/Mastercard", color: "bg-green-50 text-green-600" },
  { icon: <Truck size={20} />,      title: "Fast Delivery",  desc: "Same-day delivery across Nairobi CBD and suburbs",  color: "bg-indigo-50 text-indigo-600" },
  { icon: <Shield size={20} />,     title: "100% Genuine",   desc: "Authentic products with full manufacturer warranty", color: "bg-emerald-50 text-emerald-600" },
  { icon: <Headphones size={20} />, title: "Expert Support", desc: "Dedicated support team available 7 days a week",    color: "bg-violet-50 text-violet-600" },
];

const PRICE_TIERS = [
  { label: "Under KES 30K", range: "Budget",    icon: <Zap size={16} />,   href: "/phones", color: "text-emerald-600", bg: "hover:bg-emerald-50 hover:border-emerald-300" },
  { label: "KES 30K–100K",  range: "Mid-range", icon: <Star size={16} />,  href: "/phones", color: "text-indigo-600",  bg: "hover:bg-indigo-50 hover:border-indigo-300" },
  { label: "KES 100K+",     range: "Premium",   icon: <Award size={16} />, href: "/phones", color: "text-amber-600",   bg: "hover:bg-amber-50 hover:border-amber-300" },
];

function SectionHeader({ eyebrow, title, href, linkLabel }: { eyebrow: string; title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-1">{eyebrow}</p>
        <h2 className="text-gray-900 leading-tight" style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(1.6rem,3.5vw,2.2rem)", letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      {href && linkLabel && (
        <Link href={href}>
          <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 shrink-0 ml-4 gap-1">
            {linkLabel} <ArrowRight size={13} />
          </Button>
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const featured    = ALL_PRODUCTS.filter(p => p.is_featured);
  const phones      = ALL_PRODUCTS.filter(p => p.category === "Phones").slice(0, 4);
  const laptops     = ALL_PRODUCTS.filter(p => p.category === "Laptops");
  const accessories = ALL_PRODUCTS.filter(p => p.category === "Accessories");

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroCarousel />

      {/* ── Price tier shortcuts ─────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-indigo-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-semibold text-gray-400 shrink-0">Shop by budget:</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_TIERS.map(tier => (
                <Link key={tier.label} href={tier.href}>
                  <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white cursor-pointer transition-all duration-200 ${tier.bg}`}>
                    <span className={tier.color}>{tier.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 leading-none">{tier.range}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{tier.label}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Browse</p>
          <h2 className="text-gray-900" style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", letterSpacing: "-0.01em" }}>
            Shop by Category
          </h2>
          <p className="mt-2 text-sm text-gray-400">Find exactly what you&apos;re looking for</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} href={cat.href}>
              <Card className={`bg-gradient-to-br ${cat.gradient} border ${cat.border} hover:shadow-indigo hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center text-2xl shrink-0">{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 mb-0.5" style={{ fontFamily: "Sora, sans-serif" }}>{cat.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{cat.desc}</p>
                    <p className={`text-xs font-bold ${cat.accent}`}>{cat.count}</p>
                  </div>
                  <ArrowRight size={17} className={`${cat.accent} shrink-0 mt-1 group-hover:translate-x-1 transition-transform`} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Hand-picked" title="Featured Products" href="/phones" linkLabel="View all" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Phones ───────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="All Brands" title="Phones — Every Budget" href="/phones" linkLabel="All phones" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {phones.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Deal Banner ───────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-7xl mx-auto rounded-2xl overflow-hidden px-8 py-10"
          style={{ background: "linear-gradient(135deg, #1a1c5e 0%, #2d30a0 50%, #4f52e8 100%)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <Badge className="mb-3 bg-indigo-400/20 text-indigo-200 border-indigo-400/30">Limited Time</Badge>
              <h2 className="text-white mb-2 leading-tight" style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(1.6rem,4vw,2.5rem)" }}>
                Up to 20% off Laptops
              </h2>
              <p className="text-indigo-200 text-sm">MacBook Pro, Dell XPS, Lenovo — premium machines at Nairobi prices.</p>
            </div>
            <Link href="/laptops">
              <Button variant="white" size="lg" className="whitespace-nowrap font-bold">
                Shop Laptops <ArrowRight size={15} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Laptops ──────────────────────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Work & Create" title="Laptops" href="/laptops" linkLabel="All laptops" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {laptops.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Accessories ───────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Complete Your Setup" title="Accessories" href="/accessories" linkLabel="All accessories" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {accessories.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Why VisionTech ────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0d0f2e 0%, #1a1c5e 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Our Promise</p>
            <h2 className="text-white" style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>
              Why Shop at VisionTech?
            </h2>
            <p className="mt-2 text-sm text-indigo-300/70">Nairobi&apos;s most trusted electronics retailer</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map(item => (
              <div key={item.title} className="rounded-2xl p-5 text-center border border-indigo-900/50"
                style={{ background: "rgba(99,102,241,0.07)" }}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm text-indigo-100 mb-1" style={{ fontFamily: "Sora, sans-serif" }}>{item.title}</h3>
                <p className="text-xs leading-relaxed text-indigo-300/60 hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
