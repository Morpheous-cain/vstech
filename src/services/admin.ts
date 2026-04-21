/**
 * Admin service — typed wrappers around /api/admin endpoints.
 */

const BASE = "/api/admin";

export async function getAnalytics() {
  const res = await fetch(`${BASE}/analytics`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export async function getAdminOrders(params: { status?: string; page?: number } = {}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.page)   query.set("page", String(params.page));
  const res = await fetch(`${BASE}/orders?${query}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const res = await fetch(`/api/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order");
  return res.json();
}

export async function getAdminProducts(page = 1) {
  const res = await fetch(`${BASE}/products?page=${page}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createAdminProduct(data: Record<string, unknown>) {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "Failed to create product");
  }
  return res.json();
}

export async function bulkUpdateInventory(updates: { product_id: string; stock: number }[]) {
  const res = await fetch(`${BASE}/inventory`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates }),
  });
  if (!res.ok) throw new Error("Failed to update inventory");
  return res.json();
}

export async function validatePromo(code: string, orderTotal: number) {
  const res = await fetch("/api/promo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, order_total: orderTotal }),
  });
  if (!res.ok) throw new Error("Failed to validate promo");
  return res.json();
}
