import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { siteConfig as defaults } from "@/config/site";

interface SiteConfigData {
  title: string;
  name: string;
  slong: string;
  description: string;
  logo: string;
  logoFull: string;
}

const fallback: SiteConfigData = {
  title: "",
  name: "",
  slong: "",
  description: "",
  logo: "",
  logoFull: "",
};

let cached: SiteConfigData | null = null;
let fetchPromise: Promise<SiteConfigData> | null = null;

const fetchConfig = (): Promise<SiteConfigData> => {
  if (cached) return Promise.resolve(cached);
  if (fetchPromise) return fetchPromise;

  fetchPromise = (supabase as any)
    .from("Site config")
    .select("*")
    .limit(1)
    .single()
    .then(({ data, error }: any) => {
      if (error || !data) {
        cached = fallback;
      } else {
        cached = {
          title: data.title || fallback.title,
          name: data.name || fallback.name,
          slong: data.slong || fallback.slong,
          description: data.description || fallback.description,
          logo: data.logo || fallback.logo,
          logoFull: data.logo || fallback.logoFull,
        };
      }
      return cached!;
    });

  return fetchPromise;
};

export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfigData>(cached || fallback);

  useEffect(() => {
    fetchConfig().then(setConfig);
  }, []);

  return config;
};
