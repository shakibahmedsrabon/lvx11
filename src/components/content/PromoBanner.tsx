import { useBanner } from "@/hooks/useBanner";

const PromoBanner = () => {
  const { banner, loading } = useBanner();

  if (loading || !banner) return null;

  return (
    <section className="w-full px-6 py-12">
      <div className="relative w-full overflow-hidden rounded-lg">
        {banner.image && (
          <img
            src={banner.image}
            alt={banner.title || "Promotional banner"}
            loading="lazy"
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
          {banner.title && (
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">
              {banner.title}
            </h2>
          )}
          {banner.description && (
            <p className="text-base md:text-lg text-white/90 max-w-2xl font-light">
              {banner.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
