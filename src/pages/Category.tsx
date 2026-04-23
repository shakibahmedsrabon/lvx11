import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "@/lib/navigation";
import MainLayout from "../layouts/MainLayout";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar, { type ActiveFilters } from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import SEOHead from "../components/SEOHead";
import { getRouteMeta } from "@/config/routes";
import { useProductsByCategory, type Product } from "@/hooks/useProducts";

export type { ActiveFilters };

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    categories: [],
    priceRange: null,
    sortBy: "featured",
  });

  const { products, loading } = useProductsByCategory(category || "all");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.some(
          (c) => c.toLowerCase() === p.category.toLowerCase()
        )
      );
    }

    // Price range filter
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

    // Sorting
    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const meta = getRouteMeta("category", { category: category || "all" });

  return (
    <MainLayout>
      <SEOHead title={meta.title} description={meta.description} />
      <CategoryHeader category={category || "All Products"} />
      <FilterSortBar
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={filteredProducts.length}
        filters={filters}
        setFilters={setFilters}
      />
      <ProductGrid products={filteredProducts} loading={loading} />
    </MainLayout>
  );
};

export default Category;
