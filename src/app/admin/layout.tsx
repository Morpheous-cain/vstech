"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Warehouse,
  BarChart3, LogOut, Menu, X, ChevronRight, Bell, Settings, User
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/products",  label: "Products",   icon: Package },
  { href: "/admin/orders",    label: "Orders",     icon: ShoppingBag },
  { href: "/admin/inventory", label: "Inventory",  icon: Warehouse },
  { href: "/admin/analytics", label: "Analytics",  icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white border-r border-gray-100 shadow-sm transition-transform duration-200",
        "lg:translate-x-0 lg:static lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-indigo-sm">
              <span className="text-white font-bold text-sm font-display">V</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm leading-tight">VisionTech</p>
              <p className="text-xs text-gray-400">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-1">Main Menu</p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? path === "/admin" : path.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  active
                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                <Icon size={16} className={active ? "text-indigo-600" : "text-gray-400"} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto text-indigo-400" />}
              </Link>
            );
          })}

          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2 mt-4">Account</p>
          <Link href="/admin/settings" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Settings size={16} className="text-gray-400" /> Settings
          </Link>
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@visiontech.co.ke</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all mt-1">
            <LogOut size={16} /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-white border-b border-gray-100 shadow-sm">
          <button onClick={() => setOpen(true)} className="lg:hidden p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">VisionTech Admin</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            </button>
            <Link href="/" className="text-xs text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-all font-medium">
              View Store
            </Link>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
