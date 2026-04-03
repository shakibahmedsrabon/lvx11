import MainLayout from "../layouts/MainLayout";
import HeroSlider from "../components/content/HeroSlider";
import LargeHero from "../components/content/LargeHero";
import ProductCarousel from "../components/content/ProductCarousel";
import SEOHead from "../components/SEOHead";
import { routes } from "@/config/routes";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { siteConfig as defaults } from "@/config/site";

const Index = () => {
  const { config: siteConfig } = useSiteConfig();

  const jsonLd = siteConfig ? {
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
  } : undefined;

  return (
    <MainLayout>
      {siteConfig && (
        <SEOHead
          title={siteConfig.title}
          description={siteConfig.description}
          jsonLd={jsonLd}
        />
      )}
      {siteConfig && (
        <h1 className="sr-only">{siteConfig.name} - {siteConfig.slong}</h1>
      )}
      <ProductCarousel />
      <LargeHero />
    </MainLayout>
  );
};

export default Index;
