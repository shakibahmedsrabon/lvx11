import { useState, useMemo } from "react";
import { useParams } from "@/lib/navigation";
import MainLayout from "../layouts/MainLayout";
import FilterSortBar from "../components/category/FilterSortBar";
import InfiniteProductGrid from "../components/category/InfiniteProductGrid";
import SEOHead from "../components/SEOHead";
import AppLink from "@/lib/navigation/AppLink";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useProductsByCategory } from "@/hooks/useProducts";

export interface ActiveFilters {
  categories: string[];
  priceRange: string | null;
  sortBy: string;
}

const Shop = () => {
  const { category } = useParams();
  const activeCategory = category || "all";
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    sortBy: "featured",
  });

  const { products, loading } = useProductsByCategory(activeCategory);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.some((c) => c.toLowerCase() === p.category.toLowerCase())
      );
    }

    if (filters.priceRange) {
      result = result.filter((p) => {
        const price = p.basePrice;
        switch (filters.priceRange) {
          case "under-500":
            return price > 0 && price < 500;
          case "500-1000":
            return price >= 500 && price <= 1000;
          case "1000-2000":
            return price >= 1000 && price <= 2000;
          case "over-2000":
            return price > 2000;
          default:
            return true;
        }
      });
    }

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  const isAll = activeCategory === "all";
  const heading = isAll
    ? "Shop"
    : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  const title = isAll ? "Shop - Linea Jewelry" : `${heading} - Linea Jewelry`;
  const description = isAll
    ? "Browse all products from Linea Jewelry. Minimalist pieces crafted with timeless elegance."
    : `Shop our ${heading} collection. Minimalist jewelry crafted with timeless elegance.`;

  return (
    <MainLayout>
      <SEOHead title={title} description={description} />

      <section className="w-full px-6 mb-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <AppLink href="/">Home</AppLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {isAll ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>Shop</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <AppLink href="/shop">Shop</AppLink>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{heading}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-3xl md:text-4xl font-light text-foreground">{heading}</h1>
      </section>

      <FilterSortBar
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={filteredProducts.length}
        filters={filters}
        setFilters={setFilters}
      />
      <InfiniteProductGrid products={filteredProducts} loading={loading} pageSize={24} />
    </MainLayout>
  );
};

export default Shop;
