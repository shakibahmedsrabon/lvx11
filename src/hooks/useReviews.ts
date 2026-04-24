import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: number;
  FullName: string | null;
  star: number | null;
  profile: string | null;
  description: string | null;
  product_id: number | null;
  created_at: string;
}

export const useReviews = (productId?: number) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    let query = (supabase as any)
      .from("Reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (productId !== undefined && productId !== null) {
      query = query.eq("product_id", productId);
    }
    const { data, error } = await query;
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.star || 0), 0) / reviews.length
      : 0;

  return { reviews, loading, average, refetch: fetchReviews };
};
