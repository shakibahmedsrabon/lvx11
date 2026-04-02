/**
 * useProducts hook — fetches products from the "Products" table in the database.
 *
 * Product pricing model:
 * - `price` in DB = price per month (base monthly price)
 * - `duration` in DB = default number of months (defaults to 1 if not set)
 * - Users can increase/decrease months on the product page
 * - Total price = price × selectedMonths (auto-calculated everywhere)
 *
 * The `formatPrice` helper formats numbers as ৳ (Taka) currency.
 * The `toSlug` helper generates URL-friendly slugs from product titles.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  /** Price per month (base unit price) */
  pricePerMonth: number;
  currency: string;
  image: string;
  description?: string;
  stock: boolean;
  /** Default duration in months (minimum 1) — users can expand this */
  duration: number;
}

/**
 * Format a numeric price as ৳X,XXX (Bangladeshi Taka)
 */
export function formatPrice(price: number | null): string {
  if (price == null || price === 0) return "৳0";
  return `৳${price.toLocaleString()}`;
}

/**
 * Calculate total price based on monthly price × number of months
 */
export function calculateTotalPrice(pricePerMonth: number, months: number): number {
  return pricePerMonth * months;
}

/**
 * Generate a URL-friendly slug from a title string
 */
function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ---------- Cache layer (avoids re-fetching on every mount) ----------
let cached: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

const fetchProducts = (): Promise<Product[]> => {
  if (cached) return Promise.resolve(cached);
  if (fetchPromise) return fetchPromise;

  fetchPromise = (supabase as any)
    .from("Products")
    .select("*")
    .order("id", { ascending: true })
    .then(({ data, error }: any) => {
      if (error || !data) {
        cached = [];
        return [];
      }
      cached = data.map((row: any) => ({
        id: row.id,
        title: row.title || "",
        slug: toSlug(row.title || `product-${row.id}`),
        category: row.category || "",
        // DB `price` = monthly price; `duration` = default months (fallback 1)
        pricePerMonth: row.price || 0,
        currency: "BDT",
        image: row.image || "",
        description: row.description || undefined,
        stock: row.stock ?? true,
        duration: row.duration || 1, // default 1 month if not set
      }));
      return cached!;
    });

  return fetchPromise;
};

// ---------- Hooks ----------

/** Fetch all products */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(cached || []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    fetchProducts().then((result) => {
      setProducts(result);
      setLoading(false);
    });
  }, []);

  return { products, loading };
};

/** Find a single product by ID or slug */
export const useProduct = (idOrSlug: string | undefined) => {
  const { products, loading } = useProducts();
  const product = products.find(
    (p) => p.slug === idOrSlug || p.id === Number(idOrSlug)
  );
  return { product, loading };
};

/** Filter products by category (pass "all" to get everything) */
export const useProductsByCategory = (category: string) => {
  const { products, loading } = useProducts();
  const filtered = category && category !== "all"
    ? products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : products;
  return { products: filtered, loading };
};
