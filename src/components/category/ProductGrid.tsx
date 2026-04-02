import { Card, CardContent } from "@/components/ui/card";
import AppLink from "@/lib/navigation/AppLink";
import Pagination from "./Pagination";
import { useProductsByCategory } from "@/hooks/useProducts";
import { useParams } from "@/lib/navigation";

const ProductGrid = () => {
  const { category } = useParams();
  const { products, loading } = useProductsByCategory(category || "all");

  if (loading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-muted/20 mb-3" />
              <div className="h-4 bg-muted/20 w-1/2 mb-2" />
              <div className="h-4 bg-muted/20 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full px-6 mb-16">
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <AppLink key={product.id} href={`/product/${product.id}`}>
            <Card className="border-none shadow-none bg-transparent group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
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
                      {formatPrice(product.pricePerMonth)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AppLink>
        ))}
      </div>
      {products.length > 24 && <Pagination />}
    </section>
  );
};

export default ProductGrid;
