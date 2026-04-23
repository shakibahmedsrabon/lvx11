/**
 * HeroSlider — Samsung-style GPU-accelerated full-bleed image carousel.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import hero1 from "@/assets/hero/hero-1.jpg";
import hero2 from "@/assets/hero/hero-2.jpg";
import hero3 from "@/assets/hero/hero-3.jpg";
import hero4 from "@/assets/hero/hero-4.jpg";
import hero5 from "@/assets/hero/hero-5.jpg";

interface Slide {
  id: number;
  image: string;
  alt: string;
}

const SLIDES: Slide[] = [
  { id: 1, image: hero1, alt: "Gold pendant necklace on silk fabric" },
  { id: 2, image: hero2, alt: "Delicate gold earring on marble" },
  { id: 3, image: hero3, alt: "Diamond solitaire ring on dark velvet" },
  { id: 4, image: hero4, alt: "Pearl and diamond bridal bracelet" },
  { id: 5, image: hero5, alt: "Gift wrapped jewelry box with ribbon" },
];

const AUTO_PLAY_INTERVAL = 4500;
const TRANSITION_DURATION = 600;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef(0);
  const touchDeltaRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + total) % total);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    },
    [isTransitioning, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(next, AUTO_PLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, current, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchDeltaRef.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(touchDeltaRef.current) > 50) {
      touchDeltaRef.current < 0 ? next() : prev();
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden select-none mb-8 md:mb-12 bg-muted/20"
      style={{ height: "clamp(280px, 56vw, 520px)" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Image slides */}
      {SLIDES.map((slide, i) => {
        const isActive = i === current;
        return (
          <div
            key={slide.id}
            className="absolute inset-0"
            style={{
              willChange: "transform, opacity",
              transform: `translate3d(${(i - current) * 100}%, 0, 0)`,
              transition: `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${TRANSITION_DURATION}ms ease`,
              opacity: Math.abs(i - current) <= 1 ? 1 : 0,
              zIndex: isActive ? 2 : 1,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            aria-hidden={!isActive}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              width={1920}
              height={1088}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="w-full h-full object-cover"
              style={{
                willChange: "transform",
                transform: isActive ? "scale(1)" : "scale(1.04)",
                transition: `transform ${TRANSITION_DURATION + 600}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              }}
            />
            {/* Subtle bottom gradient to keep controls readable */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3 pb-5 md:pb-7">
        <button
          onClick={prev}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative flex items-center justify-center p-1"
            >
              <span
                className={cn(
                  "block rounded-full",
                  i === current
                    ? "w-3 h-3 bg-white"
                    : "w-2.5 h-2.5 border border-white/50 bg-transparent hover:border-white"
                )}
                style={{
                  willChange: "transform",
                  transition:
                    "width 400ms cubic-bezier(0.34,1.56,0.64,1), height 400ms cubic-bezier(0.34,1.56,0.64,1), background-color 300ms ease, border-color 300ms ease, transform 400ms cubic-bezier(0.34,1.56,0.64,1)",
                  transform: i === current ? "scale(1)" : "scale(0.85)",
                }}
              />
            </button>
          ))}
        </div>

        <button
          onClick={next}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
        </button>

        <button
          onClick={() => setIsPlaying((p) => !p)}
          className="ml-2 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause className="w-4 h-4" strokeWidth={1.5} /> : <Play className="w-4 h-4" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-10">
        <div
          className="h-full bg-white/60"
          style={{
            width: `${((current + 1) / total) * 100}%`,
            transition: `width ${TRANSITION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
            willChange: "width",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSlider;
