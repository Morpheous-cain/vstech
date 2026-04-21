"use client";
/**
 * Category / Catalogue page — improved layout with filters, search, sort, grid/list toggle.
 * Uses shadcn-style components throughout.
 */
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { Product } from "@/lib/types";

type ProductWithImage = Product & { imageUrl?: string; rating?: number; reviewCount?: number };

const ALL_PRODUCTS: ProductWithImage[] = [
  // Phones
  { id: "1", name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", description: "A18 Pro chip, titanium design, 48MP Fusion Camera. The ultimate iPhone.", category: "Phones", brand: "Apple", price: 199999, compare_price: 220000, stock: 12, images: [], specs: { Storage: "256GB", RAM: "8GB" }, is_featured: true, is_active: true, created_at: "", rating: 4.9, reviewCount: 312, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=85&fit=crop" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", slug: "samsung-galaxy-s25-ultra", description: "S Pen, 200MP camera, and Galaxy AI. Productivity powerhouse.", category: "Phones", brand: "Samsung", price: 179999, compare_price: 195000, stock: 8, images: [], specs: { Storage: "512GB", RAM: "12GB" }, is_featured: true, is_active: true, created_at: "", rating: 4.8, reviewCount: 204, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=85&fit=crop" },
  { id: "4", name: "Google Pixel 9 Pro", slug: "pixel-9-pro", description: "Magic Eraser, 50MP camera, 7 years of Android + AI updates.", category: "Phones", brand: "Google", price: 139999, compare_price: 155000, stock: 7, images: [], specs: { Storage: "256GB", RAM: "12GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 98, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=85&fit=crop" },
  { id: "5", name: "Samsung Galaxy A55", slug: "samsung-galaxy-a55", description: "120Hz AMOLED, 50MP OIS camera, 5000mAh battery. Best value.", category: "Phones", brand: "Samsung", price: 64999, compare_price: 72000, stock: 18, images: [], specs: { Storage: "128GB", RAM: "8GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.5, reviewCount: 167, imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=85&fit=crop" },
  { id: "7", name: "iPhone 15", slug: "iphone-15", description: "USB-C, Dynamic Island, 48MP main camera. Timeless design.", category: "Phones", brand: "Apple", price: 129999, compare_price: 145000, stock: 15, images: [], specs: { Storage: "128GB", RAM: "6GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 288, imageUrl: "https://images.unsplash.com/photo-1697543603910-d6d5af5e7af2?w=600&q=85&fit=crop" },
  { id: "8", name: "Tecno Spark 30 Pro", slug: "tecno-spark-30-pro", description: "6.78\" 120Hz display, 64MP camera, 5000mAh. Flagship feel, budget price.", category: "Phones", brand: "Tecno", price: 18999, compare_price: 22000, stock: 30, images: [], specs: { Storage: "256GB", RAM: "8GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.2, reviewCount: 145, imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=85&fit=crop" },
  { id: "12", name: "Xiaomi 14 Ultra", slug: "xiaomi-14-ultra", description: "Leica optics, Snapdragon 8 Gen 3, 90W wired charging.", category: "Phones", brand: "Xiaomi", price: 159999, compare_price: 175000, stock: 4, images: [], specs: { Storage: "512GB", RAM: "16GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.8, reviewCount: 76, imageUrl: "https://images.unsplash.com/photo-1598327105854-60b3a0e59fbb?w=600&q=85&fit=crop" },
  { id: "13", name: "OnePlus 12", slug: "oneplus-12", description: "Hasselblad cameras, 100W SUPERVOOC, 2K ProXDR display.", category: "Phones", brand: "OnePlus", price: 99999, compare_price: 115000, stock: 11, images: [], specs: { Storage: "256GB", RAM: "12GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.6, reviewCount: 112, imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=85&fit=crop" },
  // Laptops
  { id: "3", name: "MacBook Pro 14\" M4", slug: "macbook-pro-14-m4", description: "M4 chip, Liquid Retina XDR display, 18hr battery life.", category: "Laptops", brand: "Apple", price: 249999, compare_price: 275000, stock: 5, images: [], specs: { Processor: "Apple M4", RAM: "16GB" }, is_featured: true, is_active: true, created_at: "", rating: 4.9, reviewCount: 189, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=85&fit=crop" },
  { id: "6", name: "Dell XPS 15 OLED", slug: "dell-xps-15", description: "OLED display, Intel Core Ultra 7, 64GB RAM. Creative pro powerhouse.", category: "Laptops", brand: "Dell", price: 189999, compare_price: undefined, stock: 3, images: [], specs: { Processor: "Intel Core Ultra 7", RAM: "64GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 67, imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=85&fit=crop" },
  { id: "11", name: "Lenovo IdeaPad Slim 5", slug: "lenovo-ideapad-slim5", description: "AMD Ryzen 7, 16GB RAM, 15.6\" FHD IPS. Everyday performance.", category: "Laptops", brand: "Lenovo", price: 79999, compare_price: 92000, stock: 9, images: [], specs: { Processor: "AMD Ryzen 7", RAM: "16GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.4, reviewCount: 134, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=85&fit=crop" },
  { id: "14", name: "HP Spectre x360 14", slug: "hp-spectre-x360", description: "OLED touch, Intel Core Ultra 5, 2-in-1 convertible design.", category: "Laptops", brand: "HP", price: 149999, compare_price: 165000, stock: 6, images: [], specs: { Processor: "Intel Core Ultra 5", RAM: "16GB" }, is_featured: false, is_active: true, created_at: "", rating: 4.5, reviewCount: 88, imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=85&fit=crop" },
  // Accessories
  { id: "9", name: "AirPods Pro 2nd Gen", slug: "airpods-pro-2", description: "Active noise cancellation, USB-C, 30hr total battery life.", category: "Accessories", brand: "Apple", price: 34999, compare_price: 39999, stock: 20, images: [], specs: { "Battery Life": "30hrs (case)" }, is_featured: false, is_active: true, created_at: "", rating: 4.8, reviewCount: 356, imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=600&q=85&fit=crop" },
  { id: "10", name: "Samsung Galaxy Buds3 Pro", slug: "galaxy-buds3-pro", description: "360 Audio, ANC, intelligent Active Noise Cancellation.", category: "Accessories", brand: "Samsung", price: 24999, compare_price: 29999, stock: 14, images: [], specs: { "Battery Life": "30hrs (case)" }, is_featured: false, is_active: true, created_at: "", rating: 4.6, reviewCount: 178, imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=85&fit=crop" },
  { id: "15", name: "Apple Watch Series 10", slug: "apple-watch-series-10", description: "Thinnest Apple Watch ever. Advanced health sensors, always-on display.", category: "Accessories", brand: "Apple", price: 54999, compare_price: 62000, stock: 17, images: [], specs: { Display: "45mm LTPO OLED" }, is_featured: false, is_active: true, created_at: "", rating: 4.8, reviewCount: 224, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=85&fit=crop" },
  { id: "16", name: "Anker 735 GaN Charger", slug: "anker-735-charger", description: "65W GaN, charges laptop + phone + tablet simultaneously.", category: "Accessories", brand: "Anker", price: 5499, compare_price: 6999, stock: 45, images: [], specs: { Watts: "65W", Ports: "3" }, is_featured: false, is_active: true, created_at: "", rating: 4.7, reviewCount: 412, imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=85&fit=crop" },
];

const CATEGORIES = ["All", "Phones", "Laptops", "Accessories"];
const BRANDS = ["All Brands", "Apple", "Samsung", "Google", "Dell", "Lenovo", "HP", "Xiaomi", "OnePlus", "Tecno", "Anker"];
const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "In Stock", value: "stock" },
];
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under KES 25K", min: 0, max: 25000 },
  { label: "KES 25K – 75K", min: 25000, max: 75000 },
  { label: "KES 75K – 150K", min: 75000, max: 150000 },
  { label: "Over KES 150K", min: 150000, max: Infinity },
];

export default function CataloguePage() {
  const params = useParams();
  const rawCategory = typeof params?.category === "string" ? params.category : "";
  const urlCategory = rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1);

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES.includes(urlCategory) ? urlCategory : "All"
  );
  const [activeBrand, setActiveBrand] = useState("All Brands");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState(0);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let p = [...ALL_PRODUCTS];
    if (activeCategory !== "All") p = p.filter(x => x.category === activeCategory);
    if (activeBrand !== "All Brands") p = p.filter(x => x.brand === activeBrand);
    const range = PRICE_RANGES[priceRange];
    p = p.filter(x => x.price >= range.min && x.price <= range.max);
    if (inStockOnly) p = p.filter(x => x.stock > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      p = p.filter(x =>
        x.name.toLowerCase().includes(q) ||
        x.brand.toLowerCase().includes(q) ||
        x.description.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc")  p.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") p.sort((a, b) => b.price - a.price);
    if (sort === "rating")     p.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (sort === "stock")      p.sort((a, b) => b.stock - a.stock);
    if (sort === "featured")   p.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    return p;
  }, [activeCategory, activeBrand, sort, priceRange, search, inStockOnly]);

  const activeFiltersCount = [
    activeCategory !== "All",
    activeBrand !== "All Brands",
    priceRange !== 0,
    inStockOnly,
    search.trim() !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveBrand("All Brands");
    setPriceRange(0);
    setInStockOnly(false);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">Catalogue</span>
          {activeCategory !== "All" && (
            <>
              <ChevronRight size={14} />
              <span className="text-indigo-600 font-semibold">{activeCategory}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} products found</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-[200px] max-w-xs">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={14} />}
            />
          </div>

          {/* Filter toggle (mobile) */}
          <Button variant="white" size="sm" onClick={() => setFiltersOpen(f => !f)} className="md:hidden">
            <SlidersHorizontal size={14} />
            Filters {activeFiltersCount > 0 && <Badge variant="featured" className="ml-1 text-[10px] px-1.5 py-0">{activeFiltersCount}</Badge>}
          </Button>

          {/* Sort */}
          <div className="w-44">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Grid3X3 size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={15} />
            </button>
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`shrink-0 w-56 ${filtersOpen ? "block" : "hidden md:block"}`}>
            <Card className="p-5 sticky top-24 space-y-6">
              {/* Categories */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Category</p>
                <div className="space-y-1">
                  {CATEGORIES.map(c => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${
                        activeCategory === c
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Brand</p>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {BRANDS.map(b => (
                    <button
                      key={b}
                      onClick={() => setActiveBrand(b)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-xl transition-all ${
                        activeBrand === b
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Price Range</p>
                <div className="space-y-1">
                  {PRICE_RANGES.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setPriceRange(i)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-xl transition-all ${
                        priceRange === i
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={e => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </Card>
          </aside>

          {/* Product Grid/List */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4 opacity-30">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search term</p>
                <Button variant="outline" onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} view="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} view="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
