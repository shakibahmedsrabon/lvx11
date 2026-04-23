import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SEOHead from "../components/SEOHead";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import SliderPagination from "../components/category/SliderPagination";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Search } from "lucide-react";
import type { ActiveFilters } from "@/pages/Category";

const ITEMS_PER_PAGE_MOBILE = 8;
const ITEMS_PER_PAGE_DESKTOP = 12;

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("cat") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: null,
    sortBy: "featured",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE_DESKTOP);

  // Responsive page size
  useEffect(() => {
    const updateSize = () => {
      setPageSize(window.innerWidth < 768 ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { products, loading } = useProducts();
  const { categories: dbCategories } = useCategories();

  const categoryNames = useMemo(() => {
    if (dbCategories.length > 0) return dbCategories.map((c) => c.name);
    return [...new Set(products.map((p) => p.category))].filter(Boolean);
  }, [dbCategories, products]);

  // Filter + sort products (same logic as Category page)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

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
          case "under-500": return price > 0 && price < 500;
          case "500-1000": return price >= 500 && price <= 1000;
          case "1000-2000": return price >= 1000 && price <= 2000;
          case "over-2000": return price > 2000;
          default: return true;
        }
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-low": result.sort((a, b) => a.basePrice - b.basePrice); break;
      case "price-high": result.sort((a, b) => b.basePrice - a.basePrice); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "name": result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return result;
  }, [products, searchQuery, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleProducts = useMemo(
    () => filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredProducts, safePage, pageSize]
  );

  // Reset to page 1 on filter / search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, pageSize]);

  // Sync URL params
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("q", value.trim());
    else params.delete("q");
    setSearchParams(params, { replace: true });
  };

  const handleCategoryPill = (cat: string) => {
    const isActive = filters.categories.length === 1 && filters.categories[0].toLowerCase() === cat.toLowerCase();
    const newCats = isActive ? [] : [cat];
    setFilters({ ...filters, categories: newCats });
    const params = new URLSearchParams(searchParams);
    if (newCats.length > 0) params.set("cat", newCats[0]);
    else params.delete("cat");
    setSearchParams(params, { replace: true });
  };

  return (
    <MainLayout>
      <SEOHead
        title="Explore - E Product Hub BD"
        description="Browse all digital subscriptions, streaming services, and AI tools."
      />

      {/* Breadcrumb */}
      <CategoryHeader category="Explore" />

      {/* Search bar */}
      <div className="w-full px-6 mb-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center border-b border-border pb-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/60 outline-none text-base font-light"
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
      </div>

      {/* Category pills */}
      {categoryNames.length > 0 && (
        <div className="w-full px-6 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilters({ ...filters, categories: [] });
                const params = new URLSearchParams(searchParams);
                params.delete("cat");
                setSearchParams(params, { replace: true });
              }}
              className={`text-sm font-light py-1.5 px-4 rounded-full border transition-all duration-200 ${
                filters.categories.length === 0
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground border-border hover:border-foreground"
              }`}
            >
              All
            </button>
            {categoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryPill(cat)}
                className={`text-sm font-light py-1.5 px-4 rounded-full border transition-all duration-200 ${
                  filters.categories.some((c) => c.toLowerCase() === cat.toLowerCase())
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-foreground border-border hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Same Filter/Sort bar as Category page */}
      <FilterSortBar
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={filteredProducts.length}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Product grid (paginated) */}
      <ProductGrid products={visibleProducts} loading={loading} />

      {/* Samsung-style slider pagination */}
      {!loading && filteredProducts.length > 0 && (
        <SliderPagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </MainLayout>
  );
};

export default Explore;
