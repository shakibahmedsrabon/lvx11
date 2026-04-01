import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import LargeHero from "../components/content/LargeHero";
import FiftyFiftySection from "../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../components/content/ProductCarousel";
import EditorialSection from "../components/content/EditorialSection";
import SEOHead from "../components/SEOHead";

const Index = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Linea Jewelry",
    description: "Minimalist jewelry crafted for the modern individual",
    url: window.location.origin,
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Madison Avenue",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10016",
      addressCountry: "US",
    },
    telephone: "+1-212-555-0123",
    email: "hello@lineajewelry.com",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Linea - Minimalist Jewelry Crafted for the Modern Individual"
        description="Discover minimalist jewelry crafted with timeless elegance. Shop rings, earrings, bracelets, and necklaces from Linea."
        jsonLd={jsonLd}
      />
      <Header />
      
      <main id="main-content" className="pt-6">
        <h1 className="sr-only">Linea - Minimalist Jewelry Collection</h1>
        <FiftyFiftySection />
        <ProductCarousel />
        <LargeHero />
        <OneThirdTwoThirdsSection />
        <EditorialSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
