"use client";
/**
 * Navbar — upgraded to centered premium floating glass
 */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, User, Menu, X, ChevronRight } from "lucide-react";

const CATEGORIES = ["Phones", "Laptops", "Accessories"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const isActive = (cat: string) => pathname === `/${cat.toLowerCase()}`;

  return (
    <>
      {/* 🔥 WRAPPER (NEW — centers navbar) */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none", // allows glow outside
        }}
      >
        <header
          style={{
            width: "92%",
            maxWidth: 1200,
            borderRadius: 20,
            overflow: "hidden",
            pointerEvents: "auto",

            transition: "all 0.4s ease",

            // 🔥 Premium deep blue glass
            background: scrolled
              ? "rgba(6, 12, 40, 0.85)"
              : "rgba(6, 10, 35, 0.45)",

            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",

            border: scrolled
              ? "1px solid rgba(99,102,241,0.25)"
              : "1px solid rgba(255,255,255,0.08)",

            boxShadow: scrolled
              ? "0 10px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(99,102,241,0.15)"
              : "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ padding: "0 1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 64,
              }}
            >
              {/* Logo */}
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 14px rgba(99,102,241,0.5)",
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontFamily: "DM Serif Display, serif",
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    V
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: 18,
                    color: "#e0e7ff",
                  }}
                >
                  VisionTech
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="md-flex-nav" style={{ gap: 6 }}>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/${cat.toLowerCase()}`}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      textDecoration: "none",
                      color: isActive(cat)
                        ? "#a5b4fc"
                        : "rgba(180,190,230,0.8)",
                      background: isActive(cat)
                        ? "rgba(99,102,241,0.12)"
                        : "transparent",
                      border: isActive(cat)
                        ? "1px solid rgba(99,102,241,0.22)"
                        : "1px solid transparent",
                    }}
                  >
                    {cat}
                  </Link>
                ))}
              </nav>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setSearchOpen((s) => !s)}
                  style={iconBtn(searchOpen)}
                >
                  <Search size={16} />
                </button>

                <Link href="/account" style={iconBtn()}>
                  <User size={16} />
                </Link>

                <Link href="/cart" style={iconBtn(true)}>
                  <ShoppingCart size={16} />
                </Link>

                <button
                  onClick={() => setMobileOpen((o) => !o)}
                  className="md-hide-btn"
                  style={iconBtn(mobileOpen)}
                >
                  {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            </div>

            {/* Search */}
            {searchOpen && (
              <div style={{ paddingBottom: 12, paddingTop: 10 }}>
                <form onSubmit={handleSearch}>
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(99,102,241,0.25)",
                      color: "#e0e7ff",
                    }}
                  />
                </form>
              </div>
            )}
          </div>

          {/* Mobile */}
          {mobileOpen && (
            <div style={{ padding: "10px 16px" }}>
              {CATEGORIES.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  style={{
                    display: "block",
                    padding: "12px",
                    borderRadius: 10,
                    marginBottom: 6,
                    color: "#c7d2fe",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </header>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-flex-nav { display: flex !important; }
          .md-hide-btn { display: none !important; }
        }
        .md-flex-nav { display: none; }
      `}</style>
    </>
  );
}

/* 🔧 helper */
function iconBtn(active?: boolean) {
  return {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: active ? "rgba(99,102,241,0.18)" : "transparent",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(180,190,230,0.8)",
    cursor: "pointer",
  };
}