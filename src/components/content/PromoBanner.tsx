import { useBanner } from "@/hooks/useBanner";

const PromoBanner = () => {
  const { banner, loading } = useBanner();

  if (loading || !banner) return null;

  return (
    <section className="w-full py-12">
      <div className="w-full">
        {banner.image && (
          <img
            src={banner.image}
            alt={banner.title || "Promotional banner"}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        )}
        <div className="mt-4 text-left px-6">
          {banner.title && (
            <h2 className="text-base md:text-lg font-medium text-foreground mb-1">
              {banner.title}
            </h2>
          )}
          {banner.description && (
            <p className="text-xs md:text-sm text-muted-foreground font-light">
              {banner.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
