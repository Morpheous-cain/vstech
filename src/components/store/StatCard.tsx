import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon?: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export function StatCard({ label, value, change, icon, iconBg = "bg-indigo-50 text-indigo-600", className }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className={cn("bg-white rounded-2xl border border-indigo-100 shadow-card p-5", className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
        {icon && <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconBg)}>{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
      {change !== undefined && (
        <div className={cn("flex items-center gap-1 text-xs font-medium mt-1.5", positive ? "text-emerald-600" : "text-red-500")}>
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {positive ? "+" : ""}{change}% vs yesterday
        </div>
      )}
    </div>
  );
}
