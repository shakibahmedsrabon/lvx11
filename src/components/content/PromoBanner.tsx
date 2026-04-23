import { useBanner } from "@/hooks/useBanner";

const PromoBanner = () => {
  const { banner, loading } = useBanner();

  if (loading || !banner) return null;

  return (
    <section className="w-full px-6 py-12">
      <div className="w-full">
        {banner.image && (
          <img
            src={banner.image}
            alt={banner.title || "Promotional banner"}
            loading="lazy"
            className="w-full h-auto object-cover rounded-lg"
          />
        )}
        <div className="mt-6 text-center">
          {banner.title && (
            <h2 className="text-2xl md:text-4xl font-light text-foreground mb-3">
              {banner.title}
            </h2>
          )}
          {banner.description && (
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              {banner.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
