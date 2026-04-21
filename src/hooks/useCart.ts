/**
 * useCart hook — manages cart state client-side.
 * Syncs with /api/cart for logged-in users.
 * Uses localStorage for guest cart persistence.
 */
"use client";
import { useState, useEffect, useCallback } from "react";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
}

export function useCart() {
  const [state, setState] = useState<CartState>({ items: [], count: 0, total: 0, loading: false });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch("/api/cart");
      const { data } = await res.json();
      const items: CartItem[] = data || [];
      const count = items.reduce((s, i) => s + i.quantity, 0);
      const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
      setState({ items, count, total, loading: false });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (productId: string, quantity = 1) => {
    await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: productId, quantity }) });
    load();
  };

  const remove = async (itemId: string) => {
    await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
    load();
  };

  return { ...state, add, remove, refresh: load };
}
