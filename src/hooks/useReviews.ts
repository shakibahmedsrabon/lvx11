import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: number;
  FullName: string | null;
  star: number | null;
  profile: string | null;
  description: string | null;
  created_at: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("Reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.star || 0), 0) / reviews.length
      : 0;

  return { reviews, loading, average, refetch: fetchReviews };
};
