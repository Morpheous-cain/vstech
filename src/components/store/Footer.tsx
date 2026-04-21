"use client";
import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const LINKS = {
  Shop: ["Phones", "Laptops", "Accessories", "New Arrivals", "Deals"],
  Help: ["My Account", "Orders", "Returns", "Warranty", "Contact Us"],
};

export function Footer() {
  return (
    <footer style={{ background: "#0d0f2e", borderTop: "1px solid rgba(99,102,241,0.2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f52e8,#818cf8)" }}>
                <span className="text-white font-bold text-sm" style={{ fontFamily: "DM Serif Display, serif" }}>V</span>
              </div>
              <span className="text-indigo-100 text-lg font-normal" style={{ fontFamily: "DM Serif Display, serif" }}>VisionTech</span>
            </div>
            <p className="text-sm leading-relaxed text-indigo-300/60 mb-5 max-w-xs">
              Nairobi&apos;s premier electronics destination. Shop the latest phones, laptops, and accessories with confidence.
            </p>
            <div className="space-y-2 text-sm text-indigo-300/60">
              <div className="flex items-center gap-2"><MapPin size={13} className="text-indigo-400 shrink-0" /> Nairobi, Kenya</div>
              <div className="flex items-center gap-2"><Phone size={13} className="text-indigo-400 shrink-0" /> +254 700 000 000</div>
              <div className="flex items-center gap-2"><Mail size={13} className="text-indigo-400 shrink-0" /> hello@visiontech.co.ke</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-indigo-300/60 hover:text-indigo-200 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-indigo-900/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-indigo-300/40">
          <p>© {new Date().getFullYear()} VisionTech Electronics. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-indigo-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
