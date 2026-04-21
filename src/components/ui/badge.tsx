/**
 * Badge — shadcn/ui style, VisionTech indigo theme.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "indigo" | "success" | "warning" | "danger" | "in-stock" | "low-stock" | "out-stock" | "featured" | "new";
}

const variantClasses: Record<string, string> = {
  default:    "bg-gray-100 text-gray-700 border-gray-200",
  indigo:     "bg-indigo-50 text-indigo-700 border-indigo-200",
  success:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning:    "bg-amber-50 text-amber-700 border-amber-200",
  danger:     "bg-red-50 text-red-700 border-red-200",
  "in-stock":  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "low-stock": "bg-amber-50 text-amber-700 border-amber-200",
  "out-stock": "bg-red-50 text-red-600 border-red-200",
  featured:   "bg-indigo-600 text-white border-indigo-600",
  new:        "bg-violet-50 text-violet-700 border-violet-200",
};

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border text-xs font-semibold px-2.5 py-0.5 rounded-full",
        variantClasses[variant] ?? variantClasses.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="out-stock">Out of Stock</Badge>;
  if (stock < 5)  return <Badge variant="low-stock">Only {stock} left</Badge>;
  return <Badge variant="in-stock">In Stock</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, BadgeProps["variant"]> = {
    Pending: "warning", Packed: "indigo", Dispatched: "indigo",
    Delivered: "success", Cancelled: "danger",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, BadgeProps["variant"]> = {
    Pending: "warning", Paid: "success", Failed: "danger",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}
