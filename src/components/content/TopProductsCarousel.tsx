import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import AppLink from "@/lib/navigation/AppLink";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/hooks/useProducts";

interface TopProduct {
  id: number;
  name: string | null;
  category: string | null;
  description: string | null;
  price: number | null;
  image: string | null;
  duration: number | null;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const TopProductsCarousel = () => {
  const [items, setItems] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase as any)
      .from("Top Products")
      .select("*")
      .order("id", { ascending: true })
      .limit(10)
      .then(({ data, error }: any) => {
        if (!error && data) setItems(data as TopProduct[]);
        setLoading(false);
      });
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
          {items.map((item, index) => {
            const categorySlug = item.category ? slugify(item.category) : "";
            const href = categorySlug
              ? `/explore/${categorySlug}`
              : "/explore";
            return (
              <CarouselItem
                key={item.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
              >
                <AppLink href={href}>
                  <Card className="border-none shadow-none bg-transparent group">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <span className="absolute top-2 left-2 z-10 bg-foreground text-background text-[11px] font-medium tracking-wider px-2 py-0.5">
                          #{index + 1}
                        </span>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={`${item.name ?? "Top product"} ${item.category ?? ""}`.trim()}
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
                            {item.name}
                          </h3>
                          {item.price != null && (
                            <p className="text-sm font-light text-foreground">
                              {formatPrice(item.price)}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AppLink>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default TopProductsCarousel;
