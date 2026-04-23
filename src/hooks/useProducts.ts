/**
 * useProducts hook — fetches products from the "Products" table in the database.
 *
 * Product pricing model:
 * - `price` in DB = JSON object mapping month durations to prices
 *   Example: {"1": 400, "2": 700, "3": 800, "6": 1200, "12": 1200}
 * - Keys are the available month durations (NOT incremental — e.g. 1, 2, 3, 6, 12)
 * - Values are the total price for that duration
 * - Default selected duration = first key (lowest months)
 * - Users pick from the available durations only (no free-form +1/-1)
 *
 * The `formatPrice` helper formats numbers as ৳ (Taka) currency.
 * The `toSlug` helper generates URL-friendly slugs from product titles.
 */

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Pricing map: keys are month counts, values are prices for that duration.
 * Example: { 1: 400, 2: 700, 3: 800, 6: 1200, 12: 1200 }
 */
export type PriceMap = Record<number, number>;

export interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  /**
   * JSON pricing — keys = available month durations, values = price for that duration.
   * Available durations are ONLY those present as keys (e.g. 1, 2, 3, 6, 12).
   */
  prices: PriceMap;
  /** Sorted array of available month durations from the price JSON keys */
  availableDurations: number[];
  /** Convenience: price for the shortest (default) duration */
  basePrice: number;
  currency: string;
  image: string;
  description?: string;
  description_bn?: string;
  stock: boolean;
  /** True if product was created within the last 7 days */
  isNew: boolean;
  createdAt: string;
}

/**
 * Parse the price JSON from DB into a PriceMap.
 * Handles: object like {"1":400,"2":700}, single number (legacy), or null.
 */
export function parsePriceMap(raw: any): PriceMap {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const map: PriceMap = {};
    for (const [k, v] of Object.entries(raw)) {
      const months = parseInt(k, 10);
      const price = typeof v === "number" ? v : parseFloat(v as string);
      if (!isNaN(months) && !isNaN(price)) map[months] = price;
    }
    return Object.keys(map).length > 0 ? map : { 1: 0 };
  }
  // Legacy: single number
  if (typeof raw === "number") return { 1: raw };
  return { 1: 0 };
}

/**
 * Get sorted duration keys from a PriceMap (e.g. [1, 2, 3, 6, 12])
 */
export function getDurations(prices: PriceMap): number[] {
  return Object.keys(prices).map(Number).sort((a, b) => a - b);
}

/**
 * Format a numeric price as ৳X,XXX (Bangladeshi Taka)
 */
export function formatPrice(price: number | null): string {
  if (price == null || price === 0) return "৳0";
  return `৳${price.toLocaleString()}`;
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
    .select("id, title, category, description, description_bn, price, image, stock, created_at")
    .order("id", { ascending: true })
    .then(({ data, error }: any) => {
      if (error || !data) {
        cached = [];
        return [];
      }
      cached = data.map((row: any) => {
        const prices = parsePriceMap(row.price);
        const availableDurations = getDurations(prices);
        const createdAt = row.created_at || "";
        const isNew = createdAt
          ? (Date.now() - new Date(createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
          : false;
        return {
          id: row.id,
          title: row.title || "",
          slug: toSlug(row.title || `product-${row.id}`),
          category: row.category || "",
          prices,
          availableDurations,
          basePrice: prices[availableDurations[0]] || 0,
          currency: "BDT",
          image: row.image || "",
          description: row.description || undefined,
          description_bn: row.description_bn || undefined,
          stock: row.stock ?? true,
          isNew,
          createdAt,
        };
      });
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

/** Find a single product by ID or slug (supports `slug`, numeric id, or `slug-id`) */
export const useProduct = (idOrSlug: string | undefined) => {
  const { products, loading } = useProducts();
  // Try direct slug, numeric id, or trailing -<id> suffix (e.g. "tennis-bracelet-12")
  const trailingIdMatch = idOrSlug?.match(/-(\d+)$/);
  const trailingId = trailingIdMatch ? Number(trailingIdMatch[1]) : NaN;
  const product = products.find(
    (p) =>
      p.slug === idOrSlug ||
      p.id === Number(idOrSlug) ||
      p.id === trailingId
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
