import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: string;
  priceNumeric: number;
  currency: string;
  image: string;
  description?: string;
  stock: boolean;
  duration?: number;
}

function formatPrice(price: number | null): string {
  if (price == null) return "৳0";
  return `৳${price.toLocaleString()}`;
}

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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
        price: formatPrice(row.price),
        priceNumeric: row.price || 0,
        currency: "BDT",
        image: row.image || "",
        description: row.description || undefined,
        stock: row.stock ?? true,
        duration: row.duration || undefined,
      }));
      return cached!;
    });

  return fetchPromise;
};

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

export const useProduct = (idOrSlug: string | undefined) => {
  const { products, loading } = useProducts();
  const product = products.find(
    (p) => p.slug === idOrSlug || p.id === Number(idOrSlug)
  );
  return { product, loading };
};

export const useProductsByCategory = (category: string) => {
  const { products, loading } = useProducts();
  const filtered = category && category !== "all"
    ? products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : products;
  return { products: filtered, loading };
};
