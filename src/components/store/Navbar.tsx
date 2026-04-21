"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Phones", "Laptops", "Accessories"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); setSearchOpen(false); }
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/97 border-b border-indigo-100 shadow-indigo-sm" : "bg-white/85 border-b border-transparent"
    )} style={{ backdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4f52e8, #818cf8)" }}>
              <span className="text-white font-bold text-sm" style={{ fontFamily: "DM Serif Display, serif" }}>V</span>
            </div>
            <span className="text-gray-900 font-normal text-lg" style={{ fontFamily: "DM Serif Display, serif", letterSpacing: "-0.01em" }}>VisionTech</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {CATEGORIES.map(cat => (
              <Link key={cat} href={`/${cat.toLowerCase()}`}
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors duration-150">
                {cat}
              </Link>
            ))}
            <Link href="/compare" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Compare</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(s => !s)} className="text-gray-500 hover:text-indigo-600">
              <Search size={18} />
            </Button>
            <Link href="/account">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-indigo-600">
                <User size={18} />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-indigo-600">
                <ShoppingCart size={18} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">2</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden text-gray-600" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3 border-t border-gray-100 pt-3">
            <form onSubmit={handleSearch}>
              <Input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search phones, laptops, accessories..."
                leftIcon={<Search size={14} />}
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/97 shadow-lg px-4 py-4 space-y-1">
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/${cat.toLowerCase()}`} onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all">
              {cat}
            </Link>
          ))}
          <Link href="/compare" onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all">
            Compare
          </Link>
        </div>
      )}
    </header>
  );
}
