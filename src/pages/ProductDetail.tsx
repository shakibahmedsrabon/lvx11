import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import SEOHead from "../components/SEOHead";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { productId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Pantheon Earrings - Linea Jewelry"
        description="Discover the Pantheon earrings from Linea. Minimalist jewelry crafted with timeless elegance."
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Pantheon",
          category: "Earrings",
          brand: { "@type": "Brand", name: "Linea" },
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: "2850",
            availability: "https://schema.org/InStock",
          },
        }}
      />
      <Header />
      
      <main id="main-content" className="pt-6">
        <section className="w-full px-6" aria-label="Product details">
          {/* Breadcrumb - Show above image on smaller screens */}
          <div className="lg:hidden mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/category/earrings">Earrings</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Pantheon</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <ProductImageGallery />
            
            <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
              <ProductInfo />
              <ProductDescription />
            </div>
          </div>
        </section>
        
        <section className="w-full mt-16 lg:mt-24" aria-label="Recommended products">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">You might also like</h2>
          </div>
          <ProductCarousel />
        </section>
        
        <section className="w-full" aria-label="More from this category">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">Our other Earrings</h2>
          </div>
          <ProductCarousel />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
