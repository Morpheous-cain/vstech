/**
 * Auth guard helpers for API routes and Server Components.
 * isAdmin(), requireAuth(), requireAdmin()
 */
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentCustomer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return data;
}

export async function isAdmin(): Promise<boolean> {
  const customer = await getCurrentCustomer();
  return customer?.is_admin === true;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return { user: null, error: "Authentication required" };
  }
  return { user, error: null };
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    return { authorized: false, error: "Admin access required" };
  }
  return { authorized: true, error: null };
}
