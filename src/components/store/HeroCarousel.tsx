"use client";
/**
 * HeroSection — space-themed 3D hero.
 * Three.js phone rotates in a star/nebula cosmos.
 * Text overlay left, 3D right. Fully responsive.
 */
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const HeroScene3D = dynamic(() => import("./HeroScene3D"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 65% 50%, #0d1f5e 0%, #020408 70%)" }} />
  ),
});

const STATS = [
  { value: "120+", label: "Phone Models" },
  { value: "80+",  label: "Laptops" },
  { value: "24h",  label: "Delivery" },
];

const FEATURES = ["M-Pesa & Card", "Genuine Products", "1yr Warranty", "Free Returns"];

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [featureIdx, setFeatureIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setFeatureIdx(i => (i + 1) % FEATURES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "640px" }}
      aria-label="VisionTech Hero"
    >
      {/* 3D Canvas — full bleed */}
      <div className="absolute inset-0">
        {mounted && <HeroScene3D />}
      </div>

      {/* Vignette overlay — darkens edges for text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 75% 80% at 75% 50%, transparent 30%, rgba(2,4,8,0.55) 100%)",
        }}
      />
      {/* Left fade for text area */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(2,4,8,0.70) 0%, transparent 100%)" }}
      />

      {/* Text content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="w-full lg:w-1/2 xl:w-[45%] text-center lg:text-left">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5 justify-center lg:justify-start"
            style={{ animation: "vtHeroFade 0.6s ease both 0.1s", opacity: 0 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(130,140,255,0.35)", color: "#a5b4fc" }}>
              <Sparkles size={10} /> Nairobi&apos;s #1 Electronics Store
            </span>
          </div>

          {/* Headline */}
          <h1
            className="leading-none mb-4"
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              color: "#ffffff",
              letterSpacing: "-0.025em",
              lineHeight: 1.0,
              textShadow: "0 2px 40px rgba(0,0,10,0.8)",
              animation: "vtHeroFade 0.7s ease both 0.25s",
              opacity: 0,
            }}
          >
            The Future<br />
            <span style={{ background: "linear-gradient(90deg, #818cf8, #a5b4fc, #c7d2fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              of Tech
            </span>{" "}
            <span style={{ color: "#e0e7ff" }}>Retail</span>
          </h1>

          {/* Subline */}
          <p
            className="text-base lg:text-lg mb-2 max-w-md mx-auto lg:mx-0"
            style={{
              color: "#9da6c8",
              lineHeight: 1.6,
              animation: "vtHeroFade 0.7s ease both 0.4s",
              opacity: 0,
            }}
          >
            Premium phones, laptops & accessories — delivered same-day across Nairobi.
          </p>

          {/* Rotating feature pill */}
          <div
            className="mb-8 flex justify-center lg:justify-start"
            style={{ animation: "vtHeroFade 0.6s ease both 0.5s", opacity: 0 }}
          >
            <div className="flex items-center gap-2 text-sm"
              style={{ color: "#818cf8" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span key={featureIdx} style={{ animation: "vtFeatureFade 0.4s ease both" }}>
                {FEATURES[featureIdx]}
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10"
            style={{ animation: "vtHeroFade 0.7s ease both 0.55s", opacity: 0 }}
          >
            <Link href="/phones">
              <Button size="lg" className="gap-2 text-sm font-bold px-8 shadow-indigo">
                <ShoppingBag size={16} /> Shop Now
              </Button>
            </Link>
            <Link href="/phones">
              <Button variant="ghost" size="lg" className="text-sm font-semibold gap-1.5"
                style={{ color: "#a5b4fc", border: "1px solid rgba(130,140,255,0.3)" }}>
                View Catalogue <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {/* Stats strip */}
          <div
            className="flex items-center gap-6 justify-center lg:justify-start"
            style={{ animation: "vtHeroFade 0.7s ease both 0.7s", opacity: 0 }}
          >
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <div className="w-px h-8 opacity-20 bg-indigo-400" />}
                <div>
                  <p className="text-xl font-bold leading-none" style={{ color: "#ffffff", fontFamily: "Sora, sans-serif" }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b75a8" }}>{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(2,4,8,0.7))" }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <div className="w-5 h-8 rounded-full border border-indigo-400/50 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-indigo-400" style={{ animation: "vtScroll 1.6s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes vtHeroFade {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vtFeatureFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes vtScroll {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50%       { transform: translateY(6px); opacity: 0.3; }
        }
      `}</style>
    </section>
  );
}
