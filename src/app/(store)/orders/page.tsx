/**
 * Order History page — lists customer's past orders with status badges.
 */
"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { GoldTopCard } from "@/components/ui/card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { formatKES, formatDate } from "@/lib/utils";
import type { Order } from "@/lib/types";

const DEMO_ORDERS: Order[] = [
  { id: "ORD-2024-001", customer_id: "c1", status: "Delivered", total: 234998, delivery_address: "Kilimani, Nairobi", delivery_option: "Delivery", payment_method: "M-Pesa", payment_status: "Paid", mpesa_ref: "PGX8K2LM9Q", discount: 0, created_at: "2024-11-15T10:30:00Z" },
  { id: "ORD-2024-002", customer_id: "c1", status: "Dispatched", total: 199999, delivery_address: "Westlands, Nairobi", delivery_option: "Delivery", payment_method: "Card", payment_status: "Paid", discount: 0, created_at: "2024-12-01T14:00:00Z" },
  { id: "ORD-2024-003", customer_id: "c1", status: "Pending", total: 34999, delivery_address: "CBD, Nairobi", delivery_option: "Pickup", payment_method: "M-Pesa", payment_status: "Pending", discount: 0, created_at: "2024-12-10T09:15:00Z" },
];

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-xs text-gold font-medium uppercase tracking-wider mb-1">Account</p>
        <h1 className="font-display text-4xl text-foreground">My Orders</h1>
      </div>
      {DEMO_ORDERS.length === 0 ? (
        <div className="text-center py-20"><Package size={48} className="text-obsidian-steel mx-auto mb-4" /><p className="font-display text-xl text-foreground">No orders yet</p></div>
      ) : (
        <div className="space-y-3">
          {DEMO_ORDERS.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <GoldTopCard className="flex items-center justify-between hover:border-gold/40 transition-all cursor-pointer">
                <div className="space-y-1">
                  <p className="text-xs text-gold font-medium">{order.id}</p>
                  <p className="font-display text-sm font-medium text-foreground">{formatDate(order.created_at)}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.payment_status} />
                    <span className="text-xs text-obsidian-steel">{order.payment_method}</span>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-gold font-display font-semibold text-lg">{formatKES(order.total)}</p>
                  <ArrowRight size={16} className="text-obsidian-steel" />
                </div>
              </GoldTopCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
