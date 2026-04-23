import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import AppLink from "@/lib/navigation/AppLink";
import { useProducts, formatPrice } from "@/hooks/useProducts";

const ProductCarousel = () => {
  const { products, loading } = useProducts();

  if (loading || products.length === 0) return null;

  return (
    <section className="w-full mb-16 px-6" aria-label="Product carousel">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <AppLink href={`/explore/${product.category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                      {product.isNew && (
                        <span className="absolute top-2 left-2 z-10 bg-foreground text-background text-[10px] font-medium tracking-wider uppercase px-2 py-0.5">
                          New
                        </span>
                      )}
                      {product.image && (
                        <img
                          src={product.image}
                          alt={`${product.title} ${product.category}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/[0.03]"></div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-light text-foreground">
                        {product.category}
                      </p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {product.title}
                        </h3>
                        <p className="text-sm font-light text-foreground">
                          {formatPrice(product.basePrice)}
                        </p>
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

export default ProductCarousel;
