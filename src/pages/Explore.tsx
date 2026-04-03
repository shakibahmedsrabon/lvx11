import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEOHead from "../components/SEOHead";
import { useProducts, formatPrice, type Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";
import AppLink from "@/lib/navigation/AppLink";
import { Search, PackageSearch, Loader2 } from "lucide-react";

const ITEMS_PER_PAGE_MOBILE = 8;
const ITEMS_PER_PAGE_DESKTOP = 12;

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE_DESKTOP);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { products, loading } = useProducts();
  const { categories: dbCategories } = useCategories();

  // Derive categories from DB or products
  const categoryNames = useMemo(() => {
    if (dbCategories.length > 0) return dbCategories.map((c) => c.name);
    return [...new Set(products.map((p) => p.category))].filter(Boolean);
  }, [dbCategories, products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory) {
      result = result.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, activeCategory, searchQuery]);

  // Visible subset for infinite scroll
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const hasMore = visibleCount < filteredProducts.length;

  // Reset visible count when filters change
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setVisibleCount(isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP);
  }, [activeCategory, searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoadingMore(true);
          setTimeout(() => {
            const isMobile = window.innerWidth < 768;
            const increment = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
            setVisibleCount((prev) => prev + increment);
            setLoadingMore(false);
          }, 300);
        }
      },
      { rootMargin: "200px" }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  // Sync URL params
  const handleCategoryClick = (cat: string) => {
    const newCat = activeCategory === cat ? "" : cat;
    setActiveCategory(newCat);
    const params = new URLSearchParams(searchParams);
    if (newCat) params.set("cat", newCat);
    else params.delete("cat");
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    setSearchParams(params, { replace: true });
  };

  return (
    <MainLayout>
      <SEOHead
        title="Explore - E Product Hub BD"
        description="Browse all digital subscriptions, streaming services, and AI tools."
      />

      <div className="w-full px-6 pt-8 pb-4">
        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex items-center border-b border-border pb-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-base font-light"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="text-muted-foreground hover:text-foreground text-sm font-light ml-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        {categoryNames.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => handleCategoryClick("")}
              className={`text-sm font-light py-2 px-5 rounded-full border transition-all duration-200 ${
                !activeCategory
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground"
              }`}
            >
              All
            </button>
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`text-sm font-light py-2 px-5 rounded-full border transition-all duration-200 ${
                  activeCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm font-light text-muted-foreground mb-6">
          {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
          {searchQuery && <span> for "{searchQuery}"</span>}
          {activeCategory && <span> in {activeCategory}</span>}
        </p>
      </div>

      {/* Product grid */}
      {loading ? (
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
      ) : filteredProducts.length === 0 ? (
        <section className="w-full px-6 mb-16">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-light text-foreground mb-2">
              No products found
            </h3>
            <p className="text-sm font-light text-muted-foreground max-w-sm">
              Try a different search term or browse another category.
            </p>
          </div>
        </section>
      ) : (
        <section className="w-full px-6 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product) => (
              <AppLink key={product.id} href={`/product/${product.id}`}>
                <Card className="border-none shadow-none bg-transparent group cursor-pointer">
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
                          alt={product.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/[0.03]" />
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
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </section>
      )}
    </MainLayout>
  );
};

export default Explore;
