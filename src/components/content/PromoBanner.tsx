import { useBanner } from "@/hooks/useBanner";

const PromoBanner = () => {
  const { banner, loading } = useBanner();

  if (loading || !banner) return null;

  return (
    <section className="w-full mb-20 md:mb-24" aria-label="Featured banner">
      {banner.image && (
        <img
          src={banner.image}
          alt={banner.title || "Promotional banner"}
          loading="lazy"
          className="w-full h-auto object-cover"
        />
      )}
      {(banner.title || banner.description) && (
        <div className="mt-5 md:mt-6 px-6">
          {banner.title && (
            <h2 className="text-xl md:text-2xl font-medium text-foreground mb-1.5">
              {banner.title}
            </h2>
          )}
          {banner.description && (
            <p className="text-sm md:text-base text-muted-foreground font-light max-w-2xl">
              {banner.description}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default PromoBanner;
