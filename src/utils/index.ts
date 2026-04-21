/**
 * VisionTech — Shared Utility Functions
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format currency in KES */
export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format compact numbers (284,000 → 284K) */
export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${Math.round(amount / 1000)}K`
  return String(amount)
}

/** Format date to local string */
export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...opts,
  })
}

/** Slugify a product name */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Truncate text with ellipsis */
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

/** Build Cloudinary thumbnail URL */
export function cloudinaryThumb(url: string, w = 400, h = 400): string {
  if (!url.includes('cloudinary.com')) return url
  return url.replace('/upload/', `/upload/w_${w},h_${h},c_fill,q_auto,f_auto/`)
}

/** Parse order status to step index (for order tracking) */
export function orderStatusStep(status: string): number {
  const steps = ['Pending', 'Packed', 'Dispatched', 'Delivered']
  return steps.indexOf(status)
}

/** Calculate discount percentage */
export function discountPercent(price: number, comparePrice: number): number {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

/** Generate a random session ID for guest carts */
export function generateSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/** Get or create guest session ID from localStorage */
export function getGuestSessionId(): string {
  if (typeof window === 'undefined') return ''
  const existing = localStorage.getItem('vt_session_id')
  if (existing) return existing
  const newId = generateSessionId()
  localStorage.setItem('vt_session_id', newId)
  return newId
}

/** Debounce a function */
export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, ms: number): T {
  let timeout: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }) as T
}
