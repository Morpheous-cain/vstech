"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge, Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderStatus } from "@/lib/types";

function formatKES(n: number) { return "KES " + n.toLocaleString("en-KE"); }

const ORDERS = [
  { id: "ORD-001", customer: "John Kamau",    phone: "0712 345 678", total: 199999, status: "Pending" as OrderStatus,    payStatus: "Paid" as const,   method: "M-Pesa", items: 1, date: "2026-04-19T10:30:00Z" },
  { id: "ORD-002", customer: "Sarah Wanjiku", phone: "0723 456 789", total: 34999,  status: "Packed" as OrderStatus,     payStatus: "Paid" as const,   method: "Card",   items: 2, date: "2026-04-19T14:00:00Z" },
  { id: "ORD-003", customer: "David Ochieng", phone: "0701 234 567", total: 249999, status: "Dispatched" as OrderStatus, payStatus: "Paid" as const,   method: "M-Pesa", items: 1, date: "2026-04-18T09:15:00Z" },
  { id: "ORD-004", customer: "Grace Muthoni", phone: "0734 567 890", total: 179999, status: "Delivered" as OrderStatus,  payStatus: "Paid" as const,   method: "M-Pesa", items: 1, date: "2026-04-17T16:45:00Z" },
  { id: "ORD-005", customer: "Peter Njoroge", phone: "0745 678 901", total: 34999,  status: "Cancelled" as OrderStatus,  payStatus: "Failed" as const, method: "Card",   items: 1, date: "2026-04-17T11:00:00Z" },
  { id: "ORD-006", customer: "Faith Akinyi",  phone: "0756 789 012", total: 64999,  status: "Pending" as OrderStatus,    payStatus: "Paid" as const,   method: "M-Pesa", items: 2, date: "2026-04-16T08:30:00Z" },
  { id: "ORD-007", customer: "James Otieno",  phone: "0767 890 123", total: 139999, status: "Delivered" as OrderStatus,  payStatus: "Paid" as const,   method: "Card",   items: 1, date: "2026-04-15T12:00:00Z" },
  { id: "ORD-008", customer: "Mary Njeri",    phone: "0778 901 234", total: 24999,  status: "Packed" as OrderStatus,     payStatus: "Paid" as const,   method: "M-Pesa", items: 3, date: "2026-04-15T09:00:00Z" },
];

const STATUSES = ["All", "Pending", "Packed", "Dispatched", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => ORDERS.filter(o =>
    (statusFilter === "All" || o.status === statusFilter) &&
    (!search.trim() || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search.toUpperCase()))
  ), [search, statusFilter]);

  const totals = {
    revenue: filtered.reduce((s, o) => s + (o.payStatus === "Paid" ? o.total : 0), 0),
    count: filtered.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Fulfillment</p>
          <h1 className="text-2xl font-display font-bold text-gray-900">Orders</h1>
        </div>
        <Button variant="white" size="sm">
          <Download size={14} /> Export
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Showing", value: `${totals.count} orders` },
          { label: "Revenue", value: formatKES(totals.revenue) },
          { label: "Pending", value: `${ORDERS.filter(o => o.status === "Pending").length} orders` },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-sm font-bold text-gray-900">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or order ID..." leftIcon={<Search size={14} />} />
        </div>
        <div className="w-44">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Order ID", "Customer", "Items", "Total", "Status", "Payment", "Method", "Date", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No orders match your filters</td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-indigo-50/40 transition-colors group">
                  <td className="px-5 py-3.5 font-bold text-indigo-600 text-xs">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-gray-900">{o.customer}</p>
                    <p className="text-xs text-gray-400">{o.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{o.items} item{o.items > 1 ? "s" : ""}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">{formatKES(o.total)}</td>
                  <td className="px-5 py-3.5"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-5 py-3.5"><PaymentStatusBadge status={o.payStatus} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${o.method === "M-Pesa" ? "bg-green-50 text-green-700" : "bg-indigo-50 text-indigo-700"}`}>
                      {o.method}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                    {new Date(o.date).toLocaleDateString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${o.id}`} className="opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="outline" size="icon"><ArrowRight size={13} /></Button>
                    </Link>
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
