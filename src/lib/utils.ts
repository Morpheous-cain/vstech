/**
 * Utility functions used throughout the VisionTech platform.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format KES currency */
export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;
}

/** Format date to readable string */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Truncate text */
export function truncate(text: string, length: number): string {
  return text.length > length ? text.slice(0, length) + "..." : text;
}

/** Generate a browser session ID for guest carts */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("vt_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("vt_session_id", id);
  }
  return id;
}

/** Get Cloudinary thumbnail URL */
export function cloudinaryThumb(url: string, size = 400): string {
  if (!url) return "/placeholder-product.jpg";
  if (!url.includes("cloudinary.com")) return url;
  return url.replace("/upload/", `/upload/w_${size},h_${size},c_fill/`);
}

/** Validate Kenyan phone number */
export function validateKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "").replace(/^0/, "+254");
  return /^\+2547\d{8}$/.test(cleaned);
}

/** Format phone for M-Pesa (must start with 254) */
export function formatMpesaPhone(phone: string): string {
  let p = phone.replace(/\s+/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("0")) p = "254" + p.slice(1);
  return p;
}
