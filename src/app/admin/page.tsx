"use client";
import React from "react";
import Link from "next/link";
import { TrendingUp, Package, ShoppingBag, AlertTriangle, ArrowRight, Users, CreditCard, Truck } from "lucide-react";
import { StatCard } from "@/components/store/StatCard";
import { Card, CardIndigoTop } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";

function formatKES(n: number) { return "KES " + n.toLocaleString("en-KE"); }

const RECENT_ORDERS = [
  { id: "ORD-001", customer: "John Kamau", total: 199999, status: "Pending" as const, payStatus: "Paid" as const, method: "M-Pesa", date: "Today, 10:30" },
  { id: "ORD-002", customer: "Sarah Wanjiku", total: 34999, status: "Packed" as const, payStatus: "Paid" as const, method: "Card", date: "Today, 14:00" },
  { id: "ORD-003", customer: "David Ochieng", total: 249999, status: "Dispatched" as const, payStatus: "Paid" as const, method: "M-Pesa", date: "Yesterday" },
  { id: "ORD-004", customer: "Grace Muthoni", total: 179999, status: "Delivered" as const, payStatus: "Paid" as const, method: "Card", date: "2 days ago" },
  { id: "ORD-005", customer: "Peter Njoroge", total: 34999, status: "Cancelled" as const, payStatus: "Failed" as const, method: "Card", date: "2 days ago" },
];

const LOW_STOCK = [
  { name: "Dell XPS 15 OLED", category: "Laptops", stock: 2 },
  { name: "MacBook Pro 14 M4", category: "Laptops", stock: 3 },
  { name: "Galaxy S25 Ultra", category: "Phones", stock: 4 },
];

const MONTHLY = [220, 285, 310, 260, 390, 420, 380, 450, 480, 510, 490, 284];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const TOP_PRODUCTS = [
  { name: "iPhone 16 Pro Max", revenue: 1999990, units: 10, pct: 92 },
  { name: "MacBook Pro 14 M4", revenue: 1249995, units: 5,  pct: 58 },
  { name: "Galaxy S25 Ultra",  revenue: 1079994, units: 6,  pct: 50 },
  { name: "AirPods Pro 2",     revenue: 699980,  units: 20, pct: 32 },
];

export default function AdminDashboard() {
  const maxVal = Math.max(...MONTHLY);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1.5 rounded-xl">
          {new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "long" })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue Today" value="KES 284K" change={12.4} icon={<TrendingUp size={16} />} iconBg="bg-indigo-50 text-indigo-600" />
        <StatCard label="Orders Today" value="18" change={5.2} icon={<ShoppingBag size={16} />} iconBg="bg-violet-50 text-violet-600" />
        <StatCard label="Active Products" value="142" icon={<Package size={16} />} iconBg="bg-sky-50 text-sky-600" />
        <StatCard label="Low Stock Alerts" value="3" icon={<AlertTriangle size={16} />} iconBg="bg-amber-50 text-amber-600" />
      </div>

      {/* Second row of stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="New Customers" value="24" change={8.1} icon={<Users size={16} />} iconBg="bg-emerald-50 text-emerald-600" />
        <StatCard label="M-Pesa Revenue" value="KES 198K" change={3.2} icon={<CreditCard size={16} />} iconBg="bg-green-50 text-green-600" />
        <StatCard label="Dispatched" value="6" icon={<Truck size={16} />} iconBg="bg-indigo-50 text-indigo-600" />
        <StatCard label="Monthly Total" value="KES 5.1M" change={18.4} icon={<TrendingUp size={16} />} iconBg="bg-indigo-50 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-900">Monthly Revenue</p>
            <span className="text-xs text-gray-400">KES (thousands)</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Last 12 months</p>
          <div className="flex items-end gap-1.5 h-36">
            {MONTHLY.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                <div
                  className="w-full rounded-t-lg transition-all duration-300"
                  style={{
                    height: `${(v / maxVal) * 100}%`,
                    background: i === 11 ? "linear-gradient(to top, #4f52e8, #818cf8)" : "#e0e7ff",
                    minHeight: "4px"
                  }}
                />
                <span className="text-gray-400" style={{ fontSize: "9px" }}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Low Stock */}
        <CardIndigoTop>
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-amber-500" /> Low Stock
          </p>
          <p className="text-xs text-gray-400 mb-4">Items needing restock</p>
          <div className="space-y-3">
            {LOW_STOCK.map(item => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.category}</p>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">{item.stock} left</span>
              </div>
            ))}
          </div>
          <Link href="/admin/inventory" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-4 font-semibold transition-colors">
            Manage inventory <ArrowRight size={11} />
          </Link>
        </CardIndigoTop>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-0">
            <p className="text-sm font-semibold text-gray-900">Recent Orders</p>
            <Link href="/admin/orders" className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold transition-colors">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Order", "Customer", "Total", "Status", "Method"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECENT_ORDERS.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-3 text-indigo-600 font-semibold text-xs">{o.id}</td>
                    <td className="px-5 py-3">
                      <p className="text-gray-900 font-medium text-sm">{o.customer}</p>
                      <p className="text-xs text-gray-400">{o.date}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-900 font-semibold">{formatKES(o.total)}</td>
                    <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.method === "M-Pesa" ? "bg-green-50 text-green-700" : "bg-indigo-50 text-indigo-700"}`}>
                        {o.method}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-5">
          <p className="text-sm font-semibold text-gray-900 mb-1">Top Products</p>
          <p className="text-xs text-gray-400 mb-4">By revenue this month</p>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 w-4">#{i + 1}</span>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                  </div>
                  <p className="text-xs font-bold text-indigo-600 shrink-0 ml-2">{p.units} sold</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-indigo-50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-16 text-right">{formatKES(p.revenue).replace("KES ", "")}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
