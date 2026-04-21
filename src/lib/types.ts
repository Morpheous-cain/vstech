/**
 * Shared TypeScript types for VisionTech platform.
 * All domain models are defined here and imported throughout the app.
 */

export type Category = "Phones" | "Laptops" | "Accessories";

export type OrderStatus = "Pending" | "Packed" | "Dispatched" | "Delivered" | "Cancelled";
export type PaymentStatus = "Pending" | "Paid" | "Failed";
export type PaymentMethod = "M-Pesa" | "Card";
export type DeliveryOption = "Pickup" | "Delivery";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  brand: string;
  price: number;
  compare_price?: number;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  is_admin: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: OrderStatus;
  total: number;
  delivery_address: string;
  delivery_option: DeliveryOption;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mpesa_ref?: string;
  flw_ref?: string;
  promo_code?: string;
  discount: number;
  notes?: string;
  created_at: string;
  order_items?: OrderItem[];
  customer?: Customer;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  session_id?: string;
  customer_id?: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  customer_id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string;
  order_id: string;
  rating: number;
  body: string;
  created_at: string;
  customer?: { name: string };
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order: number;
  max_uses?: number;
  uses: number;
  active: boolean;
  expires_at?: string;
}

// API response shape
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// Product filters
export interface ProductFilters {
  category?: Category;
  brand?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  featured?: boolean;
}
