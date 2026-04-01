import MainLayout from "../layouts/MainLayout";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import EditorialSection from "../components/content/EditorialSection";
import SEOHead from "../components/SEOHead";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteConfig.name,
    description: siteConfig.tagline,
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.state,
      postalCode: siteConfig.contact.address.zip,
      addressCountry: siteConfig.contact.address.country,
    },
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
  };

  return (
    <MainLayout>
      <SEOHead
        title={routes.home.title}
        description={routes.home.description}
        jsonLd={jsonLd}
      />
      <h1 className="sr-only">Linea - Minimalist Jewelry Collection</h1>
      <FiftyFiftySection />
      <ProductCarousel />
      <LargeHero />
      <OneThirdTwoThirdsSection />
      <EditorialSection />
    </MainLayout>
  );
};

export default Index;
