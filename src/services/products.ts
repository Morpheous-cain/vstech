/**
 * Product service — typed wrappers around /api/products endpoints.
 */
import type { Product, ProductFilters, PaginatedResponse } from "@/lib/types";

const BASE = "/api";

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== "") params.set(k, String(v)); });
  const res = await fetch(`${BASE}/products?${params}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(slug: string): Promise<Product & { reviews: unknown[] }> {
  const res = await fetch(`${BASE}/products/${slug}`, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error("Product not found");
  const { data } = await res.json();
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await getProducts({ featured: true, per_page: 6 });
  return res.data;
}

export async function searchProducts(q: string): Promise<Product[]> {
  if (!q.trim() || q.length < 2) return [];
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const { data } = await res.json();
  return data ?? [];
}

export async function updateProduct(slug: string, updates: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE}/products/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update product");
  const { data } = await res.json();
  return data;
}

export async function deleteProduct(slug: string): Promise<void> {
  const res = await fetch(`${BASE}/products/${slug}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
}
