import { useState } from "react";
import { useParams, useSearchParams } from "@/lib/navigation";
import MainLayout from "../layouts/MainLayout";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import SEOHead from "../components/SEOHead";
import { getRouteMeta } from "@/config/routes";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const meta = getRouteMeta("category", { category: category || "all" });

  return (
    <MainLayout>
      <SEOHead title={meta.title} description={meta.description} />
      <CategoryHeader category={category || "All Products"} />
      <FilterSortBar
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={24}
      />
      <ProductGrid />
    </MainLayout>
  );
};

export default Category;
