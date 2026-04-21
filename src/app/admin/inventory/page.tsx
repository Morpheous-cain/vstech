"use client";
import React, { useState } from "react";
import { RefreshCw, AlertTriangle, TrendingDown, Package } from "lucide-react";
import { Card, CardIndigoTop } from "@/components/ui/card";
import { Badge, StockBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatKES(n: number) { return "KES " + n.toLocaleString("en-KE"); }

const STOCK_DATA = [
  { id: "1", name: "iPhone 16 Pro Max",       brand: "Apple",   category: "Phones",      price: 199999, stock: 12, threshold: 5,  imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=60&q=70&fit=crop" },
  { id: "2", name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Phones",      price: 179999, stock: 8,  threshold: 5,  imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=60&q=70&fit=crop" },
  { id: "3", name: "MacBook Pro 14 M4",        brand: "Apple",   category: "Laptops",     price: 249999, stock: 5,  threshold: 3,  imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=60&q=70&fit=crop" },
  { id: "4", name: "Dell XPS 15 OLED",         brand: "Dell",    category: "Laptops",     price: 189999, stock: 2,  threshold: 3,  imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=60&q=70&fit=crop" },
  { id: "5", name: "AirPods Pro 2nd Gen",      brand: "Apple",   category: "Accessories", price: 34999,  stock: 20, threshold: 5,  imageUrl: "https://images.unsplash.com/photo-1606400082777-ef05f3c5cde2?w=60&q=70&fit=crop" },
  { id: "6", name: "Google Pixel 9 Pro",       brand: "Google",  category: "Phones",      price: 139999, stock: 3,  threshold: 5,  imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=60&q=70&fit=crop" },
  { id: "7", name: "Apple Watch Series 10",    brand: "Apple",   category: "Accessories", price: 54999,  stock: 17, threshold: 5,  imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=60&q=70&fit=crop" },
  { id: "8", name: "Anker 735 GaN Charger",    brand: "Anker",   category: "Accessories", price: 5499,   stock: 0,  threshold: 10, imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=60&q=70&fit=crop" },
];

export default function AdminInventoryPage() {
  const [items, setItems] = useState(STOCK_DATA);
  const restock = (id: string, qty: number) => setItems(p => p.map(x => x.id === id ? { ...x, stock: x.stock + qty } : x));
  const lowStock = items.filter(i => i.stock <= i.threshold);
  const outOfStock = items.filter(i => i.stock === 0);
  const totalValue = items.reduce((s, i) => s + i.price * i.stock, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Stock</p>
        <h1 className="text-2xl font-display font-bold text-gray-900">Inventory</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total SKUs", value: items.length, icon: <Package size={16} />, bg: "bg-indigo-50 text-indigo-600" },
          { label: "Low Stock", value: lowStock.length, icon: <TrendingDown size={16} />, bg: "bg-amber-50 text-amber-600" },
          { label: "Out of Stock", value: outOfStock.length, icon: <AlertTriangle size={16} />, bg: "bg-red-50 text-red-600" },
          { label: "Stock Value", value: formatKES(totalValue), icon: <Package size={16} />, bg: "bg-emerald-50 text-emerald-600" },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Alert banner */}
      {lowStock.length > 0 && (
        <CardIndigoTop className="border-amber-200 bg-amber-50">
          <p className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-amber-600" />
            {lowStock.length} product{lowStock.length > 1 ? "s" : ""} need restocking
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(i => (
              <span key={i.id} className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                {i.name} — {i.stock} left
              </span>
            ))}
          </div>
        </CardIndigoTop>
      )}

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-indigo-50/40 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-indigo-50 shrink-0">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{item.category}</td>
                  <td className="px-5 py-3.5 font-bold text-indigo-600">{formatKES(item.price)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{item.stock}</span>
                      <span className="text-xs text-gray-400">units</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><StockBadge stock={item.stock} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => restock(item.id, 10)} className="text-xs">
                        <RefreshCw size={11} /> +10
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => restock(item.id, 50)} className="text-xs">
                        +50
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
