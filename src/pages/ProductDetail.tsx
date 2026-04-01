import { useParams } from "@/lib/navigation";
import AppLink from "@/lib/navigation/AppLink";
import MainLayout from "../layouts/MainLayout";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import SEOHead from "../components/SEOHead";
import { getRouteMeta } from "@/config/routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { productId } = useParams();

  const meta = getRouteMeta("product", { productName: "Pantheon" });

  return (
    <MainLayout>
      <SEOHead
        title={meta.title}
        description={meta.description}
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

      <section className="w-full px-6" aria-label="Product details">
        <div className="lg:hidden mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <AppLink href="/">Home</AppLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <AppLink href="/category/earrings">Earrings</AppLink>
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
    </MainLayout>
  );
};

export default ProductDetail;
