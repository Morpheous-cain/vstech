"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge, StockBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function formatKES(n: number) { return "KES " + n.toLocaleString("en-KE"); }

const PRODUCTS = [
  { id: "1", name: "iPhone 16 Pro Max", brand: "Apple", category: "Phones", price: 199999, stock: 12, is_featured: true, is_active: true, imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&q=70&fit=crop" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Phones", price: 179999, stock: 8, is_featured: true, is_active: true, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=80&q=70&fit=crop" },
  { id: "3", name: "MacBook Pro 14 M4", brand: "Apple", category: "Laptops", price: 249999, stock: 5, is_featured: true, is_active: true, imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=80&q=70&fit=crop" },
  { id: "4", name: "Dell XPS 15 OLED", brand: "Dell", category: "Laptops", price: 189999, stock: 2, is_featured: false, is_active: false, imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=80&q=70&fit=crop" },
  { id: "5", name: "AirPods Pro 2nd Gen", brand: "Apple", category: "Accessories", price: 34999, stock: 20, is_featured: false, is_active: true, imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=80&q=70&fit=crop" },
  { id: "6", name: "Google Pixel 9 Pro", brand: "Google", category: "Phones", price: 139999, stock: 3, is_featured: false, is_active: true, imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=80&q=70&fit=crop" },
  { id: "7", name: "Lenovo IdeaPad Slim 5", brand: "Lenovo", category: "Laptops", price: 79999, stock: 9, is_featured: false, is_active: true, imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&q=70&fit=crop" },
  { id: "8", name: "Apple Watch Series 10", brand: "Apple", category: "Accessories", price: 54999, stock: 17, is_featured: false, is_active: true, imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=80&q=70&fit=crop" },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");

  const toggle = (id: string) => setProducts(p => p.map(x => x.id === id ? { ...x, is_active: !x.is_active } : x));

  const filtered = useMemo(() => products.filter(p =>
    (catFilter === "All" || p.category === catFilter) &&
    (!search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
  ), [products, search, catFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Catalogue</p>
          <h1 className="text-2xl font-display font-bold text-gray-900">Products</h1>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm"><Plus size={14} /> Add Product</Button>
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Products", value: products.length },
          { label: "Active", value: products.filter(p => p.is_active).length },
          { label: "Low Stock", value: products.filter(p => p.stock < 5).length },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-lg font-bold text-gray-900">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or brand..." leftIcon={<Search size={14} />} />
        </div>
        <div className="w-44">
          <Select value={catFilter} onValueChange={setCatFilter}>
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["All", "Phones", "Laptops", "Accessories"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-400 ml-auto">{filtered.length} products</p>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Product", "Category", "Price", "Stock", "Status", "Featured", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/40 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 shrink-0">
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg opacity-30">📱</div>
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{p.category}</td>
                  <td className="px-5 py-3.5 font-bold text-indigo-600">{formatKES(p.price)}</td>
                  <td className="px-5 py-3.5"><StockBadge stock={p.stock} /></td>
                  <td className="px-5 py-3.5">
                    <Badge variant={p.is_active ? "success" : "danger"}>{p.is_active ? "Active" : "Hidden"}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.is_featured && <Star size={14} className="text-amber-500 fill-amber-400" />}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all">
                      <Link href={`/admin/products/${p.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit size={13} /></Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggle(p.id)}>
                        {p.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
