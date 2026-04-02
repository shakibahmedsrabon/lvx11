import MainLayout from "../layouts/MainLayout";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import EditorialSection from "../components/content/EditorialSection";
import SEOHead from "../components/SEOHead";
import { routes } from "@/config/routes";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { siteConfig as defaults } from "@/config/site";

const Index = () => {
  const siteConfig = useSiteConfig();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteConfig.name,
    description: siteConfig.slong,
    url: defaults.url,
    address: {
      "@type": "PostalAddress",
      streetAddress: defaults.contact.address.street,
      addressLocality: defaults.contact.address.city,
      addressRegion: defaults.contact.address.state,
      postalCode: defaults.contact.address.zip,
      addressCountry: defaults.contact.address.country,
    },
    telephone: defaults.contact.phone,
    email: defaults.contact.email,
  };

  return (
    <MainLayout>
      <SEOHead
        title={siteConfig.title}
        description={siteConfig.description}
        jsonLd={jsonLd}
      />
      <h1 className="sr-only">{siteConfig.name} - {siteConfig.slong}</h1>
      <FiftyFiftySection />
      <ProductCarousel />
      <LargeHero />
      <OneThirdTwoThirdsSection />
      <EditorialSection />
    </MainLayout>
  );
};

export default Index;
