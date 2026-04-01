import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import CategoryHeader from "../components/category/CategoryHeader";
import FilterSortBar from "../components/category/FilterSortBar";
import ProductGrid from "../components/category/ProductGrid";
import SEOHead from "../components/SEOHead";

const Category = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${categoryName} - Linea Jewelry`}
        description={`Shop our ${categoryName.toLowerCase()} collection. Minimalist jewelry crafted with timeless elegance.`}
      />
      <Header />
      
      <main id="main-content" className="pt-6">
        <CategoryHeader 
          category={category || 'All Products'} 
        />
        
        <FilterSortBar 
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
          itemCount={24}
        />
        
        <ProductGrid />
      </main>
      
      <Footer />
    </div>
  );
};

export default Category;
