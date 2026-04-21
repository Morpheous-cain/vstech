"use client";
import React, { useState } from "react";
import { TrendingUp, TrendingDown, ShoppingBag, Users, CreditCard } from "lucide-react";
import { Card, CardIndigoTop } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatKES(n: number) { return "KES " + n.toLocaleString("en-KE"); }

const MONTHLY = [220, 285, 310, 260, 390, 420, 380, 450, 480, 510, 490, 610];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const CATEGORY_DATA = [
  { name: "Phones",      revenue: 3200000, units: 42, pct: 58 },
  { name: "Laptops",     revenue: 1800000, units: 11, pct: 33 },
  { name: "Accessories", revenue: 520000,  units: 87, pct: 9 },
];

const PAYMENT_DATA = [
  { method: "M-Pesa", pct: 64, amount: 3533600 },
  { method: "Card",   pct: 36, amount: 1986400 },
];

const TOP_CUSTOMERS = [
  { name: "John Kamau",    orders: 4, total: 634997 },
  { name: "Grace Muthoni", orders: 3, total: 414998 },
  { name: "Sarah Wanjiku", orders: 5, total: 319995 },
  { name: "David Ochieng", orders: 2, total: 284998 },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("month");
  const maxVal = Math.max(...MONTHLY);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Insights</p>
          <h1 className="text-2xl font-display font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {["week", "month", "year"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-all ${period === p ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "KES 5.52M", change: 18.4, icon: <TrendingUp size={16} />, bg: "bg-indigo-50 text-indigo-600" },
          { label: "Total Orders", value: "148", change: 12.1, icon: <ShoppingBag size={16} />, bg: "bg-violet-50 text-violet-600" },
          { label: "Unique Customers", value: "94", change: 8.6, icon: <Users size={16} />, bg: "bg-sky-50 text-sky-600" },
          { label: "Avg Order Value", value: "KES 37.3K", change: -3.2, icon: <CreditCard size={16} />, bg: "bg-emerald-50 text-emerald-600" },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{s.label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <div className={`flex items-center gap-1 text-xs font-medium mt-1.5 ${s.change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {s.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {s.change >= 0 ? "+" : ""}{s.change}% vs last {period}
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-gray-900">Revenue Over Time</p>
            <p className="text-xs text-gray-400 mt-0.5">Monthly revenue in KES thousands</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-indigo-600">KES 610K</p>
            <p className="text-xs text-emerald-600 font-medium">↑ 24.5% this month</p>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-44">
          {MONTHLY.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-full relative">
                <div
                  className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-90"
                  style={{
                    height: `${(v / maxVal) * 160}px`,
                    background: i === 11
                      ? "linear-gradient(to top, #4338ca, #818cf8)"
                      : "linear-gradient(to top, #e0e7ff, #c7d2fe)",
                    minHeight: "6px"
                  }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-indigo-700 text-white text-xs px-2 py-0.5 rounded-lg whitespace-nowrap">
                  {v}K
                </div>
              </div>
              <span className="text-gray-400" style={{ fontSize: "9px" }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown */}
        <Card className="p-5 lg:col-span-2">
          <p className="text-sm font-semibold text-gray-900 mb-1">Revenue by Category</p>
          <p className="text-xs text-gray-400 mb-5">This {period}</p>
          <div className="space-y-5">
            {CATEGORY_DATA.map(c => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                    <Badge variant="indigo">{c.units} sold</Badge>
                  </div>
                  <p className="text-sm font-bold text-indigo-600">{formatKES(c.revenue)}</p>
                </div>
                <div className="h-2.5 bg-indigo-50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{c.pct}% of revenue</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment methods + Top customers */}
        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4">Payment Methods</p>
            <div className="space-y-3">
              {PAYMENT_DATA.map(p => (
                <div key={p.method}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.method === "M-Pesa" ? "bg-green-50 text-green-700" : "bg-indigo-50 text-indigo-700"}`}>{p.method}</span>
                    <span className="text-xs font-bold text-gray-700">{p.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${p.method === "M-Pesa" ? "bg-green-500" : "bg-indigo-500"}`} style={{ width: `${p.pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatKES(p.amount)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-gray-900 mb-4">Top Customers</p>
            <div className="space-y-3">
              {TOP_CUSTOMERS.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.orders} orders</p>
                  </div>
                  <p className="text-xs font-bold text-indigo-600 shrink-0">{formatKES(c.total)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
