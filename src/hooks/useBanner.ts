import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: number;
  title: string | null;
  description: string | null;
  image: string | null;
  created_at: string;
}

export const useBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase as any)
      .from("Banner")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }: any) => {
        if (data) setBanner(data as Banner);
        setLoading(false);
      });
  }, []);

  return { banner, loading };
};
