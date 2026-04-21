/**
 * Cart service — typed wrappers around /api/cart endpoints.
 */
import type { CartItem } from "@/lib/types";

const BASE = "/api";

export async function getCart(): Promise<CartItem[]> {
  const res = await fetch(`${BASE}/cart`, { credentials: "include" });
  if (!res.ok) return [];
  const { data } = await res.json();
  return data ?? [];
}

export async function addToCart(productId: string, quantity = 1): Promise<CartItem> {
  const res = await fetch(`${BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  const { data } = await res.json();
  return data;
}

export async function updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
  const res = await fetch(`${BASE}/cart/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  const { data } = await res.json();
  return data;
}

export async function removeFromCart(itemId: string): Promise<void> {
  const res = await fetch(`${BASE}/cart/${itemId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove from cart");
}
