import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import AppLink from "@/lib/navigation/AppLink";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, parsePriceMap, getDurations } from "@/hooks/useProducts";

interface TopRow {
  id: number;
  post_id: number | null;
  top: number | null;
}

interface ProductRow {
  id: number;
  title: string | null;
  category: string | null;
  description: string | null;
  price: any;
  image: string | null;
}

interface DisplayItem {
  rank: number;
  productId: number;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  href: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const TopProductsCarousel = () => {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: tops, error: topErr } = await (supabase as any)
        .from("Top Products")
        .select("*")
        .order("top", { ascending: true })
        .limit(10);

      if (topErr || !tops || tops.length === 0) {
        setLoading(false);
        return;
      }

      const ids = (tops as TopRow[])
        .map((t) => t.post_id)
        .filter((v): v is number => v != null);

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      const { data: products } = await (supabase as any)
        .from("Products")
        .select("*")
        .in("id", ids);

      const productMap = new Map<number, ProductRow>();
      (products as ProductRow[] | null)?.forEach((p) => productMap.set(p.id, p));

      const display: DisplayItem[] = (tops as TopRow[])
        .map((t, idx) => {
          if (t.post_id == null) return null;
          const p = productMap.get(t.post_id);
          if (!p) return null;
          const title = p.title || `Product ${p.id}`;
          const category = p.category || "";
          const prices = parsePriceMap(p.price);
          const durations = getDurations(prices);
          const basePrice = prices[durations[0]] || 0;
          // Unique URL: /explore/{category-slug}/{title-slug}-{id}
          const titleSlug = slugify(title);
          const productSlug = `${titleSlug}-${p.id}`;
          const categorySlug = category ? slugify(category) : "all";
          const href = `/explore/${categorySlug}/${productSlug}`;
          return {
            rank: t.top ?? idx + 1,
            productId: p.id,
            title,
            category,
            image: p.image || "",
            basePrice,
            href,
          };
        })
        .filter((v): v is DisplayItem => v !== null);

      setItems(display);
      setLoading(false);
    };

    load();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="w-full mb-16 px-6" aria-label="Top 10 trending products">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-light text-foreground tracking-wide uppercase">
          Top 10 Trending
        </h2>
        <span className="text-xs font-light text-muted-foreground">
          This week
        </span>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item.productId}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <AppLink href={item.href}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                      <span className="absolute top-2 left-2 z-10 bg-foreground text-background text-[11px] font-medium tracking-wider px-2 py-0.5">
                        #{item.rank}
                      </span>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={`${item.title} ${item.category}`.trim()}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/[0.03]" />
                    </div>
                    <div className="space-y-1">
                      {item.category && (
                        <p className="text-sm font-light text-foreground">
                          {item.category}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {item.title}
                        </h3>
                        {item.basePrice > 0 && (
                          <p className="text-sm font-light text-foreground">
                            {formatPrice(item.basePrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AppLink>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default TopProductsCarousel;
